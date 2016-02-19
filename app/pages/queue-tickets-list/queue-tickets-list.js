import {Page, NavController, NavParams} from 'ionic/ionic';

/*
  Generated class for the QueuesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
    templateUrl: 'build/pages/queue-tickets-list/queue-tickets-list.html',
})
export class QueueTicketsListPage {
    constructor(nav: NavController, navParams: NavParams) {
    this.nav = nav;
    this.navParams = navParams;
        this.queue = this.navParams.data;
  }
}
