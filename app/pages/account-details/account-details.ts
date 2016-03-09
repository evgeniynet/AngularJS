import {Page, NavController, NavParams} from 'ionic-framework/ionic';
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
        var account = {  
            "name":"",
            "account_statistics":{  
                "ticket_counts":{  
                    "open":0,
                    "closed":0,
                },
                "timelogs":0,
                "invoices":0,
                "hours":0,
                "expenses":0
            }
        };
        this.account = this.navParams.data || account;
        
        this.tickets = null;
        this.dataProvider = dataProvider;
        this.dataProvider.getTicketsList("open", this.account.id).subscribe(
            data => {this.tickets = data}, 
            error => { 
                console.log(error || 'Server error');}
        ); 
  }
}
