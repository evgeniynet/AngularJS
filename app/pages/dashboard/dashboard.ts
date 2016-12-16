import {Page, Config, Nav} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {TicketProvider} from '../../providers/ticket-provider';
import {TimeProvider} from '../../providers/time-provider';
import {Focuser} from '../../directives/directives';
import {QueuesListComponent, AccountsListComponent, ActionButtonComponent} from '../../components/components';
import {TicketsPage} from '../tickets/tickets';
import {AccountDetailsPage} from '../account-details/account-details';
import {AjaxSearchPage} from '../ajax-search/ajax-search';
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
    simple: boolean = false;
    timer: any;
    downloadTimer: any;

    constructor(private nav: Nav, private config: Config, private dataProvider: DataProvider, private ticketProvider: TicketProvider, private timeProvider: TimeProvider) {
        let counts = config.getStat("tickets");
        if (counts == -1){
            this.downloadTimer = setInterval(()=>{ this.counts.open_as_tech = ++this.counts.open_as_tech;},800);
        }
        else {
        if (config.current.user.is_limit_assigned_tkts && !config.current.user.is_admin)
                    counts.open_all = Math.max(counts.open_as_user, counts.open_as_tech); 
        this.counts = counts; 
    }
    }
    
    onPageLoaded()
    {       
        this.simple = !this.config.current.is_time_tracking && !this.config.current.is_expenses;
        this.ticketProvider.getTicketsCounts();
        this.ticketProvider.tickets$["tickets/counts"].subscribe(
            data => {

                if (this.config.current.user.is_limit_assigned_tkts && !this.config.current.user.is_admin)
                    data.open_all = Math.max(data.open_as_user, data.open_as_tech);    
                clearInterval(this.downloadTimer);
                this.counts = data;
                this.config.setStat("tickets",
                {
                    "all": data.open_all,
                    "tech": data.open_as_tech,
                    "alt": data.open_as_alttech,
                    "user": data.open_as_user
                });
                setTimeout(() => {this.saveCache()}, 1500);
            },
            error => {
                clearInterval(this.downloadTimer);
                console.log(error || 'Server error');
            }
            );

        if (this.config.current.is_unassigned_queue) {
            this.queues = this.config.getCache("dashqueues");

            this.dataProvider.getQueueList(3).subscribe(
                data => {
                    this.queues = data;
                    this.config.setCache("dashqueues", data);
                },
                error => {
                    console.log(error || 'Server error');
                }
                );

        }

        if (this.config.current.is_account_manager) {
            this.accounts = this.config.getCache("dashaccounts");

            let accountslen = 500; //this.config.getStat("accounts");

            let pager = { limit: ~accountslen ? accountslen : 500 };

            if (!this.accounts || this.accounts.length == 0)
                this.dataProvider.getAccountList(true, pager, true, true).subscribe(
                    data => {
                        this.accounts = data;
                        this.config.setStat("accounts", data.length);
                        if (this.simple)
                            this.config.setCache("dashaccounts", data);
                    },
                    error => {
                        console.log(error || 'Server error');
                    }
                    );

            if (!this.simple)
                this.dataProvider.getAccountList(true, pager).subscribe(
                    data => {
                        this.accounts = data;
                        this.config.setCache("dashaccounts", data);
                    },
                    error => {
                        console.log(error || 'Server error');
                    }
                    );  
        }
        
        if (!this.ticketProvider._dataStore.tech.length){
            this.ticketProvider.getTicketsList("tech", "", { "limit": 6 }); 
        }

        this.timer = setTimeout(() => {
            if (!this.ticketProvider._dataStore.user.length) {
                this.ticketProvider.getTicketsList("user", "", { "limit": 6 });
            }
            if (!(this.timeProvider._dataStore["time"] || {}).length)
                this.timeProvider.getTimelogs("", { "limit": 25 });
        }, 2500);
    }

    onPageDidEnter()
    {
        
    }

    saveCache(){
        let el = document.elementFromPoint(window.innerWidth/2, window.innerHeight/2);
        let content = el.closest('ion-nav');
        if (content){
        window.dash = content.innerHTML.replace(/\s\s+/g,' ');
    }
    }

    ngOnDestroy(){
        clearTimeout(this.timer);  
    }

    clearSearch(searchbar)
    {
        searchbar.value = "";
    }

    getTicket(searchbar) {
        // Reset items back to all of the items
        // set q to the value of the searchbar
        //if (searchbar.target.value.trim().length > 2) {
            let list = { search: searchbar.target.value };
            this.test = false;
            this.nav.push(AjaxSearchPage, list);
            //}
        }

        itemTappedTL(tab) {  
            if (this.config.current.user.is_limit_assigned_tkts && tab.tab == 'all')
            {
                this.nav.alert("Please contact Administator to obtain permission to view All Tickets", true);
                //return;
            }
            this.nav.setRoot(TicketsPage, tab);}

            itemTappedAD() {this.nav.setRoot(AccountDetailsPage);}

        }
