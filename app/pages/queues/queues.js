import {Page, NavController} from 'ionic/ionic';
import {TicketsPage} from '../tickets/tickets';
import {DataProvider} from '../../providers/data-provider';
import {QueuesListComponent} from '../../components/queues-list/queues-list';
/*
  Generated class for the QueuesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/queues/queues.html',
    directives: [QueuesListComponent]
})
export class QueuesPage {
    constructor(nav: NavController, dataProvider: DataProvider) {
    this.nav = nav;
        this.queues = null;
        
        dataProvider.getQueueList().subscribe(
            data => {this.queues = data}, 
            error => { 
                console.log(error || 'Server error');}
        ); 
  }

}
