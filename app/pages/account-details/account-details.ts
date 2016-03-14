import {Page, Config, NavController, NavParams} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
import {getCurrency} from '../../directives/helpers';
import {TicketsListComponent} from '../../components/tickets-list/tickets-list';
import {ActionButtonComponent} from '../../components/action-button/action-button';
import {MorePipe} from '../../pipes/pipes';

@Page({
  templateUrl: 'build/pages/account-details/account-details.html',
    directives: [TicketsListComponent, ActionButtonComponent],
    pipes: [MorePipe],
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
        this.projects = null;
        this.dataProvider = dataProvider;
        
        this.dataProvider.getTicketsList("open", this.account.id).subscribe(
            data => {this.tickets = data}, 
            error => { 
                console.log(error || 'Server error');}
        );
        
        this.dataProvider.getAccountDetails(this.account.id).subscribe(
            data => {
                this.account = data;
                    }, 
            error => { 
                console.log(error || 'Server error');}
        ); 
  }
    
    getCurrency(value) {
        return getCurrency(value, this.config.current.currency);
    }
}
