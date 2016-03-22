import {Page, Config, NavController} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
import * as helpers from '../../directives/helpers';
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
    this.counts = {open_as_tech: 0};   
  }
    
    onPageLoaded()
    {           
        this.accounts = helpers.loadCache("dashaccounts");

        let statistics = this.config.current.stat;
        let pager = {limit: (statistics.accounts + 5) || 500};

        this.dataProvider.getQueueList(3).subscribe(
            data => {this.queues = data}, 
            error => { 
                console.log(error || 'Server error');}
        ); 

        if (!this.accounts || this.accounts.length ==0)
            this.dataProvider.getAccountList(true, pager, true, true).subscribe(
                data => {
                    this.accounts = data;
                }, 
                error => { 
                    console.log(error || 'Server error');}
            );   

        this.dataProvider.getAccountList(true, pager).subscribe(
            data => {
                this.accounts = data;
                helpers.saveCache("dashaccounts", data);
            }, 
            error => { 
                console.log(error || 'Server error');}
        ); 

        this.dataProvider.getTicketsCounts().subscribe(
            data => {
                this.counts = data;
                this.config.current.stat.tickets = data;
            }, 
            error => { 
                console.log(error || 'Server error');}
        ); 
    }
    
    itemTappedTL() {  this.nav.push(TicketsPage);}
    
    itemTappedAD() {this.nav.push(AccountDetailsPage);}

}
