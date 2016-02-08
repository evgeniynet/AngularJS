import {Page, NavController} from 'ionic/ionic';
import {TicketsPage} from '../tickets/tickets';
import {QueuesPage} from '../queues/queues';
import {AccountDetailsPage} from '../account-details/account-details';

/*
  Generated class for the DashboardPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/dashboard/dashboard.html',
})
export class DashboardPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
    
    itemTappedTL() {this.nav.push(TicketsPage);}
    
    itemTappedQ() {this.nav.push(QueuesPage);}
    
    itemTappedAD() {this.nav.push(AccountDetailsPage);}
}
