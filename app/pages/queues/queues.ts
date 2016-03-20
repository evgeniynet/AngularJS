import {Page, NavController} from 'ionic-framework/ionic';
import {TicketsPage} from '../tickets/tickets';
import {DataProvider} from '../../providers/data-provider';
import {QueuesListComponent, ActionButtonComponent} from '../../components/components';

@Page({
  templateUrl: 'build/pages/queues/queues.html',
    directives: [QueuesListComponent, ActionButtonComponent]
})
export class QueuesPage {
    constructor(nav: NavController, dataProvider: DataProvider) {
    this.nav = nav;
        
        dataProvider.getQueueList().subscribe(
            data => {this.queues = data
                    }, 
            error => { 
                console.log(error || 'Server error');}
        ); 
  }

}
