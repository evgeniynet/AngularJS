import {Nav, NavParams, Page, ViewController, Config} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {TicketProvider} from '../../../providers/ticket-provider';
import {ApiData} from '../../../providers/api-data';
import {htmlEscape, getFullName} from '../../../directives/helpers';
import {SelectListComponent} from '../../../components/select-list/select-list';


@Page({
    templateUrl: 'build/pages/modals/close-ticket/close-ticket.html',
    directives: [forwardRef(() => SelectListComponent)],
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
            "user" : {
                    name: "user", 
                    value: getFullName(this.he.firstname, this.he.lastname, this.he.email),
                    selected: this.he.user_id,
                    url: "users",
                    hidden: false,
                },
            "category": {
                name: "Category",
                value: "Choose",
                selected: 0,
                hidden: false,
                items: []
            }
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
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
        if (name == "resolution")
        {
            this.selects.category.value = "Choose";
            this.selects.category.selected = 0;
            this.selects.category.items = this.selects.resolution.selected ?
                this.categories.filter(v => v.is_resolved) : this.categories.filter(v => !v.is_resolved);
            this.selects.category.hidden = !this.selects.category.items.length;
        }
        if (name == "user"){
            let repeat = false;
            let user = {
                "id": this.selects.user.selected,
                "name": this.selects.user.value
            };
            for (var n = 0; n < this.users.length; n++) {
                if (this.users[n].id == user.id){
                   repeat = true;
                   break;
                }
            }
            if (!repeat)
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

            if (this.config.current.is_ticket_require_closure_note && !post.length)
            {
                this.nav.alert("Note is required!",true);
                return;
            }
            let user_ids = "";
            if(this.users.length){
                for (var n = 0;  n < this.users.length; n++) {
                   user_ids += this.users[n].id + ", ";
                 }
                 user_ids = user_ids.slice(0,-2);
            }
            console.log(user_ids,"user_ids");

            let data = {
                "status": "closed",
                "note_text": post,
                "is_send_notifications": true,
                "resolved": this.selects.resolution.selected == 1,
                "resolution_id": this.selects.category.selected,
                "confirmed": this.isconfirm,
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