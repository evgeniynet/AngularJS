import {Page, NavController, NavParams} from 'ionic/ionic';
import {DataProvider} from '../../providers/data-provider';
import {TicketsListComponent} from '../../components/tickets-list/tickets-list';
import {GravatarPipe} from '../../pipes/gravatar';
import {LinebreaksPipe} from '../../pipes/linebreaks';

@Page({
  templateUrl: 'build/pages/ticket-details/ticket-details.html',
    pipes: [GravatarPipe, LinebreaksPipe],
})
export class TicketDetailsPage {
    constructor(nav: NavController, navParams: NavParams, dataProvider: DataProvider) {
        this.nav = nav;
        this.details_tab = "Reply";
        this.navParams = navParams;
        this.dataProvider = dataProvider;
        this.ticket = this.navParams.data || {};
        this.details = {};
         this.dataProvider.getTicketDetails(this.ticket.key).subscribe(
            data => {this.details = data}, 
            error => { 
                console.log(error || 'Server error');}
        ); 
    }
}
