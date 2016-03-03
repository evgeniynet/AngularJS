import {Page, Config, NavController} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
import {QueuesListComponent, AccountsListComponent, ActionButtonComponent} from '../../components/components';
import {TicketsPage} from '../tickets/tickets';
import {AccountDetailsPage} from '../account-details/account-details';
import {MorePipe} from '../../pipes/pipes';

@Page({
  templateUrl: 'build/pages/dashboard/dashboard.html',
    directives: [QueuesListComponent, AccountsListComponent, ActionButtonComponent],
    pipes: [MorePipe],
})
export class DashboardPage {
    constructor(nav: NavController, config: Config, dataProvider: DataProvider) {
    this.nav = nav;
    this.config = config;
    this.dataProvider = dataProvider;
    this.queues = null;
    this.accounts = null;
    this.counts = {open_as_tech: 0};
        
        console.log(config.user);
        
        dataProvider.getQueueList(3).subscribe(
            data => {this.queues = data}, 
            error => { 
                console.log(error || 'Server error');}
        ); 
        
        dataProvider.getAccountList(true).subscribe(
            data => {this.accounts = data}, 
            error => { 
                console.log(error || 'Server error');}
        ); 
        
        dataProvider.getTicketsCounts().subscribe(
            data => {this.counts = data}, 
            error => { 
                console.log(error || 'Server error');}
        ); 
  }
    
    itemTappedTL() {this.nav.push(TicketsPage);}
    
    itemTappedAD() {this.nav.push(AccountDetailsPage);}

}
