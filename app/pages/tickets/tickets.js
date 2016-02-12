import {Page, NavController, NavParams} from 'ionic/ionic';
import {TicketDetailsPage} from '../ticket-details/ticket-details';

@Page({
  templateUrl: 'build/pages/tickets/tickets.html',
    url: "/tickets",
})
export class TicketsPage {
  constructor(nav: NavController, navParams: NavParams) {
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

    itemTapped() {this.nav.push(TicketDetailsPage);}
    
}
