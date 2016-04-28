import {Page, NavController, NavParams, Modal} from 'ionic-angular';
import {TicketCreatePage} from '../modals/modals';
import {TicketDetailsPage} from '../ticket-details/ticket-details';
import {TicketsListComponent} from '../../components/tickets-list/tickets-list';

@Page({
    templateUrl: 'build/pages/queue-tickets/queue-tickets.html',
    directives: [TicketsListComponent],
})
export class QueueTicketsPage {

	queue: any;
	
    constructor(private nav: NavController, private navParams: NavParams) {
        this.queue = this.navParams.data;
  }
    
    onPageWillEnter()
    {
        //console.log("show");
        //this.queue.tickets_count += 1;
    }

    addTicket() {
        let myModal = Modal.create(TicketCreatePage, { 'tech': { id: this.queue.id, name: 'Queue ' + this.queue.fullname } });
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
