import {Page, NavController, NavParams} from 'ionic-angular';
import {TicketsListComponent} from '../../components/tickets-list/tickets-list';
import {ActionButtonComponent} from '../../components/action-button/action-button';

@Page({
    templateUrl: 'build/pages/queue-tickets/queue-tickets.html',
    directives: [TicketsListComponent, ActionButtonComponent],
})
export class QueueTicketsPage {

	queue: any;
	
    constructor(private nav: NavController, private navParams: NavParams) {
  }
    
    onPageWillEnter()
    {
        this.queue = this.navParams.data;
    }
}
