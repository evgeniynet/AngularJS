import {Page, Config, Nav} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {TicketProvider} from '../../providers/ticket-provider';
import * as helpers from '../../directives/helpers';
import {Focuser} from '../../directives/directives';
import {QueuesListComponent, AccountsListComponent, ActionButtonComponent} from '../../components/components';
import {TicketsPage} from '../tickets/tickets';
import {AccountDetailsPage} from '../account-details/account-details';
import {MorePipe} from '../../pipes/pipes';

@Page({
    templateUrl: 'build/pages/dashboard/dashboard.html',
    directives: [QueuesListComponent, AccountsListComponent, ActionButtonComponent, Focuser],
    pipes: [MorePipe],
})
export class DashboardPage {

    counts: Object = { open_as_tech: 0 };
    accounts: Array<any> = [];
    queues: Array<any> = [];
    searchQuery: string = '';
    test: boolean;

    constructor(private nav: Nav, private config: Config, private dataProvider: DataProvider, private ticketProvider: TicketProvider) {
    }
    
    onPageLoaded()
    {       
        this.ticketProvider.getTicketsCounts();
        this.ticketProvider.tickets$["tickets/counts"].subscribe(
            data => {
                this.counts = data;
                this.config.setStat("tickets",
                    {
                        "all": data.open_all,
                        "tech": data.open_as_tech,
                        "alt": data.open_as_alttech,
                        "user": data.open_as_user
                    });
            },
            error => {
                console.log(error || 'Server error');
            }
        );

        if (this.config.current.is_unassigned_queue) {
            this.queues = helpers.loadCache("dashqueues");

            this.dataProvider.getQueueList(3).subscribe(
                data => {
                this.queues = data;
                    helpers.saveCache("dashqueues", data);
                },
                error => {
                    console.log(error || 'Server error');
                }
            );

        }

        if (this.config.current.is_account_manager) {
            this.accounts = helpers.loadCache("dashaccounts");

            let accountslen = this.config.getStat("accounts");

            let pager = { limit: ~accountslen ? 500 : accountslen };

            if (!this.accounts || this.accounts.length == 0)
                this.dataProvider.getAccountList(true, pager, true, true).subscribe(
                    data => {
                        this.accounts = data;
                        this.config.setStat("accounts", data.length);
                    },
                    error => {
                        console.log(error || 'Server error');
                    }
                );

            this.dataProvider.getAccountList(true, pager).subscribe(
                data => {
                    this.accounts = data;
                    helpers.saveCache("dashaccounts", data);
                },
                error => {
                    console.log(error || 'Server error');
                }
            );  
        }
        
        if (!this.ticketProvider._dataStore.tech.length){
            this.ticketProvider.getTicketsList("tech", "", { "limit": 6 }); 
        }
        if (!this.ticketProvider._dataStore.user.length){
            this.ticketProvider.getTicketsList("user", "", { "limit": 6 }); 
        }
    }

    clearSearch(searchbar)
    {
        searchbar.value = "";
    }

    getItems(searchbar) {
    // Reset items back to all of the items
    // set q to the value of the searchbar
    var q = searchbar.target.value;
    console.log(q);
  }
    
    itemTappedTL(tab) {  
        if (this.config.current.is_limit_assigned_tkts && tab.tab == 'all')
        {
            this.nav.alert("Please contact Administator to obtain permission to view All Tickets", true);
            return;
        }
        this.nav.setRoot(TicketsPage, tab);}
    
    itemTappedAD() {this.nav.setRoot(AccountDetailsPage);}

}
