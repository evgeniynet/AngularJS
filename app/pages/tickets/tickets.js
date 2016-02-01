import {Page, NavController} from 'ionic/ionic';

/*
  Generated class for the TicketsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
import {IonicApp, Page, NavController, NavParams} from 'ionic/ionic';
import {ItemDetailsPage} from '../item-details/item-details';

@Page({
  templateUrl: 'build/pages/tickets/tickets.html',
})
export class TicketsPage {
  constructor(app: IonicApp, nav: NavController, navParams: NavParams) {
    this.nav = nav;
  
    // If we navigated to this page, we will have an item available as a nav param
      this.selectedItem = navParams.get('item');

    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for(let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  itemTapped(event, item) {

    console.log('You selected:', item.title);

     this.nav.push(ItemDetailsPage, {
       item: item
     });
  }
    
}
