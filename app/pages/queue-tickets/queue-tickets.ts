import {Page, Nav, NavParams, Modal, ViewController} from 'ionic-angular';
import {TicketCreatePage} from '../modals/modals';
import {TicketDetailsPage} from '../ticket-details/ticket-details';
import {TicketsListComponent} from '../../components/tickets-list/tickets-list';

@Page({
    templateUrl: 'build/pages/queue-tickets/queue-tickets.html',
    directives: [TicketsListComponent],
})
export class QueueTicketsPage {

	queue: any;
	
    constructor(private nav: Nav, private navParams: NavParams, private view: ViewController) {
        this.queue = this.navParams.data;
  }

onPageWillEnter() {
            this.view.setBackButtonText('');
    }
    
    addTicket() {
        let myModal = Modal.create(TicketCreatePage, { 'tech': { id: this.queue.id, name: 'Queue ' + this.queue.fullname } });
        myModal.onDismiss(data1 => {
            if (data1)
                setTimeout(() => {
                    this.queue.tickets_count += 1;
                    this.nav.push(TicketDetailsPage, data1);
                }, 500);
        });
        this.nav.present(myModal);
    }
}
