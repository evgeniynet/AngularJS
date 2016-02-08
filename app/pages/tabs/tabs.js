import {Page, NavController} from 'ionic/ionic';
import {TicketDetailsPage} from '../ticket-details/ticket-details';
import {TicketsListPage} from '../tickets-list/tickets-list';
/*
  Generated class for the TabsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/tabs/tabs.html',
})
export class TabsPage {
  constructor(nav: NavController) {
    this.nav = nav;
      this.tab1Root = TicketsListPage;
      this.tab2Root = TicketDetailsPage;
      this.tab3Root = TicketsListPage;
      this.tab4Root = TicketDetailsPage;
  }
}
