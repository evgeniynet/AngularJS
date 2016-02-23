import {Page, NavController, NavParams} from 'ionic/ionic';
import {GravatarPipe} from '../../pipes/gravatar';

@Page({
  templateUrl: 'build/pages/ticket-details/ticket-details.html',
    pipes: [GravatarPipe],
})
export class TicketDetailsPage {
    constructor(nav: NavController, navParams: NavParams) {
        this.nav = nav;
        this.details_tab = "Reply";
        this.navParams = navParams;
        // If we navigated to this page, we will have an item available as a nav param
        this.ticket = {};
        this.ticket = this.navParams.data;
    }
}
