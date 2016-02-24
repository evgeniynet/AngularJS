import {Page, ActionSheet, NavController} from 'ionic/ionic';
import {DataProvider} from '../../providers/data-provider';
import {QueuesListComponent} from '../../components/queues-list/queues-list';
import {AccountsListComponent} from '../../components/accounts-list/accounts-list';
import {ActionButtonComponent} from '../../components/action-button/action-button';
import {TicketsPage} from '../tickets/tickets';
import {AccountDetailsPage} from '../account-details/account-details';
import {MorePipe} from '../../pipes/more';

/*
  Generated class for the DashboardPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/dashboard/dashboard.html',
    directives: [QueuesListComponent, AccountsListComponent, ActionButtonComponent],
    pipes: [MorePipe],
})
export class DashboardPage {
    constructor(nav: NavController, dataProvider: DataProvider) {
    this.nav = nav;
    this.queues = null;
    this.accounts = null;
    this.counts = {open_as_tech: 0};
        
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
