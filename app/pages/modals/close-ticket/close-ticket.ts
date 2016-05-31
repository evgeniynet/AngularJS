import {Nav, NavParams, Page, ViewController, Config} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {TicketProvider} from '../../../providers/ticket-provider';
import {ApiData} from '../../../providers/api-data';
import {htmlEscape} from '../../../directives/helpers';
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

    constructor(private nav: Nav, private navParams: NavParams, private apiData: ApiData, private ticketProvider: TicketProvider, private config: Config,
        private viewCtrl: ViewController) {
        nav.swipeBackEnabled = false;
    }


    ngOnInit() {

        this.isconfirm = true;

        this.ticket = this.navParams.data || 0;

        this.categories = [];

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
            "category": {
                name: "Category",
                value: "Choose",
                selected: 0,
                hidden: false,
                items: []
            }
        };

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
    }
    
    onSubmit(form) {
        if (form.valid) {
            var post = htmlEscape(this.ticketnote.trim()).substr(0, 5000);

            let data = {
                "status": "closed",
                "note_text": post,
                "is_send_notifications": true,
                "resolved": this.selects.resolution.selected == 1,
                "resolution_id": this.selects.category.selected,
                "confirmed": this.isconfirm,
                "confirm_note": ""

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