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

    ticket: any;
    selects: any;

    constructor(private nav: Nav, private navParams: NavParams, private ticketProvider: TicketProvider, private config: Config,
        private viewCtrl: ViewController) {
        nav.swipeBackEnabled = false;
        this.config = config;
    }


    ngOnInit() {

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
            let newuser = {
                "name": this.selects.value,
                "user_id": this.selects.selected,
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