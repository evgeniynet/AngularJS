import {Page, NavController} from 'ionic/ionic';
import {DataProvider} from '../../providers/data-provider';
import {TicketsListComponent, ActionButtonComponent} from '../../components/components';

@Page({
    templateUrl: 'build/pages/tickets/tickets.html',
    directives: [TicketsListComponent, ActionButtonComponent],
})
export class TicketsPage {
    constructor(nav: NavController, dataProvider: DataProvider) {
        this.nav = nav;
        this.tickets = null;
        this.ticket_tab = "user";
        this.dataProvider = dataProvider;

        dataProvider.getTicketsList().subscribe(
            data => {this.tickets = data}, 
            error => { 
                console.log(error || 'Server error');}
        ); 
    }

    onSegmentChanged($event) {
        let tab = $event.value; this.dataProvider.getTicketsList(tab).subscribe(
            data => {this.tickets = data}, 
            error => { 
                console.log(error || 'Server error');}
        ); 
    }
}
