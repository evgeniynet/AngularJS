import {Page, Config, NavController, NavParams, Modal} from 'ionic-angular';
import {TicketCreatePage} from '../modals/modals'; 
import {TicketDetailsPage} from '../ticket-details/ticket-details';
import {TicketsListComponent} from '../../components/components';

@Page({
    templateUrl: 'build/pages/tickets/tickets.html',
    directives: [TicketsListComponent],
})
export class TicketsPage {

    counts: any;
    ticket_tab: string;
    
    constructor(private nav: NavController, private navParams: NavParams, private config: Config) {
           this.counts = {};
    }
    
    onPageLoaded()
    {
        let param = this.navParams.data || {};
        if (param.count)
            this.counts[param.tab] = param.count;
        this.ticket_tab = this.config.getCurrent("is_tech") ? 
            (param.tab || "tech") : "user";
        this.nav.tickets_tab = null;
    }

    onPageWillEnter()
    {

    }

    addTicket(){
        let myModal = Modal.create(TicketCreatePage);
            myModal.onDismiss(data1 => {
                if (data1)
                    setTimeout(() => {
                        this.nav.push(TicketDetailsPage, data1);
                    }, 500);
            });
            setTimeout(() => {
                this.nav.present(myModal);
            }, 500);
    }

}
