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

    account_id: any;
    keep_attached: boolean;
    ticketnote: string;
    ticket: any;
    selects: any;
    is_techs_only: boolean = false;

    constructor(private nav: Nav, private navParams: NavParams, private ticketProvider: TicketProvider, private config: Config,
        private viewCtrl: ViewController) {
        nav.swipeBackEnabled = false;
        this.config = config;
    }


    ngOnInit() {

        this.keep_attached = false;

        this.ticket = this.navParams.data || 0;
        this.account_id = this.ticket.account_id;
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
        this.viewCtrl.dismiss(data);
    }

    saveSelect(event) {
        let name = event.type;
        this.selects.selected = event.id;
        this.selects.value = event.name;
        this.account_id = event.id;
    }
    
    onSubmit(form) {
        if (form.valid) {
            var post = htmlEscape((this.ticketnote || "").trim()).substr(0, 5000);
            let newtech = {
                "note_text": post,
                "name": this.selects.value,
                "tech_id": this.selects.selected,
                "keep_attached": this.keep_attached,
                "is_techs_only": this.is_techs_only,
                "action":  "transfer",
            };
            this.ticketProvider.transferUserTech(this.ticket.key, newtech).subscribe(
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