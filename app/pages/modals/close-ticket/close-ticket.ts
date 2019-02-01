import {Nav, NavParams, Page, ViewController, Config} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {TicketProvider} from '../../../providers/ticket-provider';
import {ApiData} from '../../../providers/api-data';
import {ClassListComponent} from '../../../components/class-list/class-list';
import {htmlEscape, getFullName} from '../../../directives/helpers';
import {SelectListComponent} from '../../../components/select-list/select-list';



@Page({
    templateUrl: 'build/pages/modals/close-ticket/close-ticket.html',
    directives: [forwardRef(() => SelectListComponent), forwardRef(() => ClassListComponent)],
})
export class CloseTicketModal {

    isconfirm: boolean;
    ticketnote: string;
    ticket: any;
    selects: any;
    categories: any;
    he: any;
    users: any = [];

    constructor(private nav: Nav, private navParams: NavParams, private apiData: ApiData, private ticketProvider: TicketProvider, private config: Config,
        private viewCtrl: ViewController) {
        nav.swipeBackEnabled = false;
        this.config = config;
    }


    ngOnInit() {

        this.isconfirm = true;

        this.ticket = this.navParams.data || 0;

        this.categories = [];
        this.he = this.config.getCurrent("user");

        this.selects = {
            "resolution": {
                name: "Resolution",
                value: "Resolved",
                selected: 1,
                hidden: false,
                items: [
                    { "name": 'Resolved', "id": 1 },
                    { "name": 'UnResolved', "id": 0 },
                ]
            },
            "cc" : {
                    name: "CC", 
                    value: "Choose "+ this.config.current.names.user.s,
                    selected: 0,
                    url: "users",
                    hidden: false,
                },
            "class": {
                 name: "Class",
                 value: this.ticket.class_name || "Choose",
                 selected: this.ticket.class_id || 0,
                 url: "classes",
                 preload: !this.ticket.class_id && this.config.current.is_class_tracking,
                 hidden: this.ticket.class_id || !this.config.current.is_class_tracking,
       },
       "categories": {
                 name: "Creation Category",
                 value: this.ticket.creation_category_name || "Choose",
                 selected: this.ticket.creation_category_id || 0,
                 url: "categories",
                 preload: this.config.current.is_creation_categories && !this.ticket.creation_category_id,
                 hidden: this.ticket.creation_category_id || !this.config.current.is_creation_categories
       },
            "category": {
                name: "Category",
                value: "Choose",
                selected: 0,
                hidden: false,
                items: []
            },
        };

        if (!this.config.current.is_resolution_tracking)
            return;

        this.apiData.get("resolution_categories").subscribe(
            data => {
                this.categories = data;
                this.selects.category.items = data.filter(v => v.is_resolved);
                this.selects.category.hidden = !this.selects.category.items.length;
            },
            error => {
                console.log(error || 'Server error');
            }
        );
    }

    dismiss(num?) {
        //let data = { 'foo': 'bar' };
        //item = item || {};
        this.viewCtrl.dismiss(num || 0);
    }

    saveSelect(event) {
        let name = event.type;
        if (name == "creationcategory")
            name = "categories";
        if (name == "resolution")
        {
            this.selects[name].selected = event.id;
            this.selects[name].value = event.name;
            this.selects.category.value = "Choose";
            this.selects.category.selected = 0;
            this.selects.category.items = this.selects.resolution.selected ?
                this.categories.filter(v => v.is_resolved) : this.categories.filter(v => !v.is_resolved);
            this.selects.category.hidden = !this.selects.category.items.length;
        }
        else if (name == "category")
        {
            this.selects[name].selected = event.id;
            this.selects[name].value = event.name;
        }
        else if (name == "categories")
        {
            this.selects[name].selected = event.id;
            this.selects[name].value = event.name;
        }
        else if (name == "class")
        {
            this.selects[name].selected = event.id;
            this.selects[name].value = event.name;
        }
        else if (name == "cc"){
            this.selects[name].selected = 0;
            this.selects[name].value = "Choose "+ this.config.current.names.user.s;
            let user = {
                "id": event.email,
                "name": event.name
            };   
            if (this.users.filter(u => u.id == user.id).length == 0)
                this.users.push(user);
        }
    }
    deleteUser(user_id){
        let num;
        for (var n = 0;  n < this.users.length; n++) {
            if(this.users[n].id == user_id){
                num = n;
            }
        }
        this.users.splice(num, 1);
    }
    
    onSubmit(form) {
        if (form.valid) {
            var post = htmlEscape((this.ticketnote || "").trim()).substr(0, 5000);

            if(!this.selects.class.selected && this.config.current.is_class_tracking)
            {
                this.nav.alert("A class must be entered before ticket may be closed!",true);
                return;
            }
            if (this.config.current.is_ticket_require_closure_note && !post.length)
            {
                this.nav.alert("Note is required!",true);
                return;
            }
            if (this.config.current.is_creation_categories && !this.selects.categories.selected)
            {
                this.nav.alert("A creation category must be entered before ticket may be closed!",true);
                return;
            }
            let user_ids = this.users.map(u => u.id).join(", ");

            let data = {
                "status": "closed",
                "note_text": post,
                "is_send_notifications": true,
                "resolved": this.selects.resolution.selected == 1,
                "resolution_id": this.selects.category.selected,
                "class_id": this.selects.class.selected,
                "confirmed": this.isconfirm,
                "creation_category_id": this.selects.categories.selected,
                "creation_category_name": this.selects.categories.value,
                "confirm_note": "",
                "cc": user_ids
            };

            this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(
                data => {
                    this.nav.alert('Ticket has been closed :)');
                    this.dismiss(1);
                },
                error => {
                    console.log(error || 'Server error');
                }
                );
        }
    }

}