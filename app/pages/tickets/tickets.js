import {Page, NavController, NavParams} from 'ionic/ionic';
import {DataProvider} from '../../providers/data-provider';
import {TicketDetailsPage} from '../ticket-details/ticket-details';
import {TicketsListComponent} from '../../components/tickets-list/tickets-list';
import {MorePipe} from '../../pipes/more';

@Page({
  templateUrl: 'build/pages/tickets/tickets.html',
    directives: [TicketsListComponent],
    pipes: [MorePipe],
})
export class TicketsPage {
    constructor(nav: NavController, navParams: NavParams, dataProvider: DataProvider) {
    this.nav = nav;
        this.tickets = null;
  
        dataProvider.getTicketsList().subscribe(
            data => {this.tickets = data}, 
            error => { 
                console.log(error || 'Server error');}
        ); 
  }

    itemTapped() {this.nav.push(TicketDetailsPage);}
    
}
