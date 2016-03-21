import {Page, NavController, NavParams} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
import {TicketsListComponent} from '../../components/tickets-list/tickets-list';
import {ActionButtonComponent} from '../../components/action-button/action-button';

@Page({
    templateUrl: 'build/pages/queue-tickets/queue-tickets.html',
    directives: [TicketsListComponent, ActionButtonComponent],
})
export class QueueTicketsPage {
    constructor(nav: NavController, navParams: NavParams, dataProvider: DataProvider) {
    this.nav = nav;
    this.navParams = navParams;
        this.queue = this.navParams.data;
  }
    
    onPageLoaded()
    {
        if (this.queue.tickets_count){
            dataProvider.getTicketsList("queue", this.queue.id).subscribe(
                data => {this.tickets = data}, 
                error => { 
                    console.log(error || 'Server error');}
            ); 
        }
        else
            this.tickets = null;
    }
}
