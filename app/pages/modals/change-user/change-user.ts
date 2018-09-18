import {Nav, NavParams, Page, ViewController, Config} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {TicketProvider} from '../../../providers/ticket-provider';
import {htmlEscape} from '../../../directives/helpers';
import {SelectListComponent} from '../../../components/select-list/select-list';


@Page({
    templateUrl: 'build/pages/modals/change-user/change-user.html',
    directives: [forwardRef(() => SelectListComponent)],
})
export class ChangeUserModal {

    keep_attached: boolean;
    ticketnote: string;
    ticket: any;
    selects: any;

    constructor(private nav: Nav, private navParams: NavParams, private ticketProvider: TicketProvider, private config: Config,
        private viewCtrl: ViewController) {
        nav.swipeBackEnabled = false;
        this.config = config;
    }


    ngOnInit() {

        this.keep_attached = false;
        console.log("name", this.config.current);
        this.ticket = this.navParams.data || 0;

        this.selects = {
            "user": {
                name: "user",
                value: "Choose",
                selected: 0,
                hidden: false,
                url: "users"
                            },
        };
           }

    dismiss(data) {
        //let data = { 'foo': 'bar' };
        //item = item || {};
        this.viewCtrl.dismiss(data);
    }

    saveSelect(event) {
        let name = event.type;
        this.selects.selected = event.id;
        this.selects.value = event.name;
    }
    
    onSubmit(form) {
        if (form.valid) {
            var post = htmlEscape((this.ticketnote || "").trim()).substr(0, 5000);
            let newuser = {
                "note_text": post,
                "name": this.selects.value,
                "user_id": this.selects.selected,
                "keep_attached": this.keep_attached
            };
            this.ticketProvider.closeOpenTicket(this.ticket.key, newuser).subscribe(
       data => {
         this.nav.alert(this.config.current.names.ticket.s + ' has been transferred :)');
         this.dismiss(newuser);
       },
       error => {
         this.nav.alert(error, true);
         console.log(error || 'Server error');
       }
       );

        }
    }

}