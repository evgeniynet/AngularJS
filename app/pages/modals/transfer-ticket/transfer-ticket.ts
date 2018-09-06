import {Nav, NavParams, Page, ViewController, Config} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {TicketProvider} from '../../../providers/ticket-provider';
import {htmlEscape} from '../../../directives/helpers';
import {SelectListComponent} from '../../../components/select-list/select-list';


@Page({
    templateUrl: 'build/pages/modals/transfer-ticket/transfer-ticket.html',
    directives: [forwardRef(() => SelectListComponent)],
})
export class TransferTicketModal {

    isconfirm: boolean;
    ticketnote: string;
    ticket: any;
    selects: any;

    constructor(private nav: Nav, private navParams: NavParams, private ticketProvider: TicketProvider, private config: Config,
        private viewCtrl: ViewController) {
        nav.swipeBackEnabled = false;
        this.config = config;
    }


    ngOnInit() {

        this.isconfirm = false;

        this.ticket = this.navParams.data || 0;

        this.selects = {
            "tech": {
                name: "tech",
                value: "Choose",
                selected: 0,
                hidden: false,
                url: "technicians"
                            },
        };
           }

    dismiss(data) {
        //let data = { 'foo': 'bar' };
        //item = item || {};
        console.log(data);
        console.log(this.viewCtrl.dismiss(data));
        this.viewCtrl.dismiss(data);
    }

    saveSelect(event) {
        console.log(event);
        let name = event.type;
        this.selects.selected = event.id;
        this.selects.value = event.name;
    }
    
    onSubmit(form) {
        if (form.valid) {
            var post = htmlEscape((this.ticketnote || "").trim()).substr(0, 5000);

            let newtech = {
                "note": post,
                "name": this.selects.value,
                "id": this.selects.selected,
            };
            console.log(newtech);
            this.ticketProvider.closeOpenTicket(this.ticket.key, newtech).subscribe(
       data => {
         this.nav.alert(this.config.current.names.ticket.s + ' has been transferred :)');
         this.dismiss(newtech);
       },
       error => {
         this.nav.alert(error, true);
         console.log(error || 'Server error');
       }
       );

        }
    }

}