import {Page, Config, NavController} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {TicketProvider} from '../../providers/ticket-provider';
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
    constructor(nav: NavController, config: Config, dataProvider: DataProvider, private ticketProvider: TicketProvider) {
        this.nav = nav;
        this.config = config;
        this.dataProvider = dataProvider;  
    }
    
    onPageWillEnter()
    {           
        this.counts = {open_as_tech: 0}; 
        this.accounts = helpers.loadCache("dashaccounts");
        this.queues = helpers.loadCache("dashqueues");

        let statistics = this.config.current.stat;
        let pager = {limit: (statistics.accounts + 5) || 500};

        this.dataProvider.getQueueList(3).subscribe(
            data => { this.queues = data;
                helpers.saveCache("dashqueues", data);
            }, 
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
        
        if (!this.ticketProvider._dataStore.tech.length){
            this.ticketProvider.getTicketsList("tech", "", { "limit": 6 }); 
        }


        this.dataProvider.getAccountList(true, pager).subscribe(
            data => {
                this.accounts = data;
                helpers.saveCache("dashaccounts", data);
            }, 
            error => { 
                console.log(error || 'Server error');}
                ); 

        this.dataProvider.getTicketsCounts();
        this.dataProvider.data$["tickets/counts"].subscribe(
            data => {
                this.counts = data;
                this.config.current.stat.tickets =
                {
                    "all": data.open_all,
                    "tech":  data.open_as_tech,
                    "alt": data.open_as_alttech,
                    "user": data.open_as_user
                };
            }, 
            error => { 
                console.log(error || 'Server error');}
                ); 
    }
    
    itemTappedTL(tab) {  this.nav.setRoot(TicketsPage, tab);}
    
    itemTappedAD() {this.nav.setRoot(AccountDetailsPage);}

}
