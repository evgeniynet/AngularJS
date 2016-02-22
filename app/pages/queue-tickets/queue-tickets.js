import {Page, NavController, NavParams} from 'ionic/ionic';
import {DataProvider} from '../../providers/data-provider';
import {TicketsListComponent} from '../../components/tickets-list/tickets-list';

@Page({
    templateUrl: 'build/pages/queue-tickets/queue-tickets.html',
    directives: [TicketsListComponent],
})
export class QueueTicketsPage {
    constructor(nav: NavController, navParams: NavParams, dataProvider: DataProvider) {
    this.nav = nav;
    this.navParams = navParams;
        this.queue = this.navParams.data;
        
        dataProvider.getTicketsList("queue", this.queue.id).subscribe(
            data => {this.tickets = data}, 
            error => { 
                console.log(error || 'Server error');}
        ); 
  }
}
