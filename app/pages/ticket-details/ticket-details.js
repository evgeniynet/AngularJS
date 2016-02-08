import {IonicApp, Page, NavController, NavParams} from 'ionic/ionic';

/*
  Generated class for the TicketDetailsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/ticket-details/ticket-details.html',
})
export class TicketDetailsPage {
    constructor(app: IonicApp, nav: NavController, navParams: NavParams) {
        this.nav = nav;
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedItem = navParams.get('item');
    }
}
