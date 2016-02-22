import {Page, NavController} from 'ionic/ionic';
import {DataProvider} from '../../providers/data-provider';
import {TicketsListComponent} from '../../components/tickets-list/tickets-list';

@Page({
  templateUrl: 'build/pages/tickets/tickets.html',
    directives: [TicketsListComponent],
})
export class TicketsPage {
    constructor(nav: NavController, dataProvider: DataProvider) {
    this.nav = nav;
        this.tickets = null;
  
        dataProvider.getTicketsList().subscribe(
            data => {this.tickets = data}, 
            error => { 
                console.log(error || 'Server error');}
        ); 
  }
    
}
