import {Page, NavController} from 'ionic/ionic';
import {TicketsPage} from '../tickets/tickets';

/*
  Generated class for the QueuesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/queues/queues.html',
})
export class QueuesPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
    
    itemTappedTL() {this.nav.push(TicketsPage);}
}
