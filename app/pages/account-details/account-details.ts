import {Page, Config, NavController, NavParams} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
import {getCurrency} from '../../directives/helpers';
import {TicketsListComponent} from '../../components/tickets-list/tickets-list';
import {ActionButtonComponent} from '../../components/action-button/action-button';

@Page({
  templateUrl: 'build/pages/account-details/account-details.html',
    directives: [TicketsListComponent, ActionButtonComponent],
})
export class AccountDetailsPage {
    constructor(nav: NavController, navParams: NavParams, dataProvider: DataProvider, config: Config) {
    this.nav = nav;
        this.config = config;
        this.details_tab = "Stat";
        this.navParams = navParams;
        // If we navigated to this page, we will have an item available as a nav param
        this.account = this.navParams.data || {};
        
        this.tickets = null;
        this.dataProvider = dataProvider;
        this.dataProvider.getTicketsList("open", this.account.id).subscribe(
            data => {this.tickets = data}, 
            error => { 
                console.log(error || 'Server error');}
        ); 
  }
    
    getCurrency(value) {
        return getCurrency(value, this.config.current.currency);
    }
}
