import {Page, Config, Nav, NavParams, Modal, ViewController} from 'ionic-angular';
import {TicketCreatePage} from '../modals/modals';
import {TicketDetailsPage} from '../ticket-details/ticket-details';
import {TicketsListComponent} from '../../components/tickets-list/tickets-list';
import {TechniciansListComponent} from '../../components/techs-list/techs-list';

@Page({
    templateUrl: 'build/pages/tech-tickets/tech-tickets.html',
    directives: [TicketsListComponent],
})
export class TechTicketsPage {

	technician: any;
	
    constructor(private nav: Nav, private navParams: NavParams, private view: ViewController, private config: Config) {
        this.technician = this.navParams.data;
         console.log(this.technician);
  }

onPageWillEnter() {
            this.view.setBackButtonText('');
    }
    
    addTicket() {
        let myModal = Modal.create(TicketCreatePage, { 'tech': { id: this.technician.id, name: this.technician.lastname + " "+ this.technician.firstname } });
        myModal.onDismiss(data1 => {
            if (data1)
                setTimeout(() => {
                    this.technician.tickets_count += 1;
                    this.nav.push(TicketDetailsPage, data1);
                }, 500);
        });
        this.nav.present(myModal);
    }
}
