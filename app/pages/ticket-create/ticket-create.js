import {Page, NavController} from 'ionic/ionic';

@Page({
  templateUrl: 'build/pages/ticket-create/ticket-create.html',
})
export class TicketCreatePage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}
