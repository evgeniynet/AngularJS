import {Page, NavController, NavParams} from 'ionic/ionic';
import {DataProvider} from '../../providers/data-provider';
import {TicketsListComponent} from '../../components/tickets-list/tickets-list';
import {ActionButtonComponent} from '../../components/action-button/action-button';

@Page({
  templateUrl: 'build/pages/account-details/account-details.html',
    directives: [TicketsListComponent, ActionButtonComponent],
})
export class AccountDetailsPage {
    constructor(nav: NavController, navParams: NavParams, dataProvider: DataProvider) {
    this.nav = nav;
        this.details_tab = "Stat";
        this.navParams = navParams;
        // If we navigated to this page, we will have an item available as a nav param
        this.account = {  
            "account_statistics":{  
                "ticket_counts":{  
                },
            }
        };
        this.account = this.navParams.data;
        
        this.tickets = null;
        this.dataProvider = dataProvider;
        this.dataProvider.getTicketsList("open", this.account.id).subscribe(
            data => {this.tickets = data}, 
            error => { 
                console.log(error || 'Server error');}
        ); 
  }
}
