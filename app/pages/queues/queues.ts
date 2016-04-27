import {Page, NavController} from 'ionic-angular';
import {TicketsPage} from '../tickets/tickets';
import {DataProvider} from '../../providers/data-provider';
import {QueuesListComponent, ActionButtonComponent} from '../../components/components';

@Page({
  templateUrl: 'build/pages/queues/queues.html',
    directives: [QueuesListComponent, ActionButtonComponent]
})
export class QueuesPage {

    queues: any;
    
    constructor(private nav: NavController, private dataProvider: DataProvider) {
  }
    
    onPageLoaded()
    {
        this.dataProvider.getQueueList().subscribe(
            data => {this.queues = data
                    }, 
            error => { 
                console.log(error || 'Server error');}
        ); 
    }

}
