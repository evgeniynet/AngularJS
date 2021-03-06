import {Page, Config, Nav} from 'ionic-angular';
import {ApiData, DataProvider, TicketProvider, TimeProvider} from '../../providers/providers';
import {getDateTime} from '../../directives/helpers';
import {Focuser} from '../../directives/directives';
import {QueuesListComponent, AccountsListComponent, ActionButtonComponent, TodoListComponent} from '../../components/components';
import {TicketsPage} from '../tickets/tickets';
import {TimelogsPage} from '../timelogs/timelogs';
import {AccountDetailsPage} from '../account-details/account-details';
import {TicketDetailsPage} from '../ticket-details/ticket-details';
import {AjaxSearchPage} from '../ajax-search/ajax-search';
import {MorePipe} from '../../pipes/pipes';
import {addp} from '../../directives/helpers';
import {Subject} from 'rxjs';

@Page({
    templateUrl: 'build/pages/dashboard/dashboard.html',
    directives: [QueuesListComponent, AccountsListComponent, ActionButtonComponent, TodoListComponent, Focuser],
    pipes: [MorePipe],
})
export class DashboardPage {

    counts: Object = { open_as_tech: 0 };
    accounts: Array<any> = [];
    queues: Array<any> = [];
    queue_id: any = [];
    term: string = '';
    test: boolean;
    simple: boolean = false;
    timer: any;
    timelogs: any;
    cachename: string;
    working: number = 0;
    non_working_hours: number = 0;
    downloadTimer: any;
    search_results: any;
    busy: boolean;
    date: any;
    private unsubscribe$:Subject<void> = new Subject();

    constructor(private nav: Nav, private config: Config, private apiData: ApiData, private dataProvider: DataProvider, private ticketProvider: TicketProvider, private timeProvider: TimeProvider) {
        let counts = config.getStat("tickets");
        if (counts == -1 && config.current.is_online){
            this.downloadTimer = setInterval(()=>{ this.counts.open_as_tech = ++this.counts.open_as_tech;},800);
        }
        else {
            if (config.current.user.is_limit_assigned_tkts && !config.current.user.is_admin)
                counts.open_all = Math.max(counts.open_as_user, counts.open_as_tech); 
            this.counts = this.counts || counts; 
        }
    }
    
    onPageLoaded()
    {       
        this.simple = !this.config.current.is_time_tracking && !this.config.current.is_expenses;
        let options = {
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          year: 'numeric'
        };
        this.date = new Date().toLocaleString("en-US", options);

        let localQueres_id = localStorage.getItem('queue_id');
        this.queue_id = localQueres_id ? localStorage.getItem('queue_id').split(", ") : [];

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
                setTimeout(() => {this.saveCache()}, 1000);
            },
            error => {
                clearInterval(this.downloadTimer);
                console.log(error || 'Server error');
            }
            );

        if (this.config.current.is_unassigned_queue) {
            this.queues = this.config.getCache("dashqueues");
            if (this.queue_id.length == 0) {
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
            else{
                this.dataProvider.getQueueList().subscribe(
                data => {  
                    this.queues = data.filter( v => this.queue_id[0] == v.id || this.queue_id[1] == v.id || this.queue_id[2] == v.id);
                    let default_queues = data.filter( v => this.queue_id[0] != v.id  && this.queue_id[1] != v.id && this.queue_id[2] != v.id);
                    let difference = 3-this.queues.length;
                    if (difference > 0)
                    {
                        this.queues.push(...default_queues.slice(0,difference));
                    }
                    this.config.setCache("dashqueues", this.queues);

                },
                error => {
                    console.log(error || 'Server error');
                }
                );
            }

        }

        if (this.config.current.is_account_manager) {
            this.accounts = this.config.getCache("dashaccounts");

            let accountslen = 500; //this.config.getStat("accounts");

            let pager = { limit: ~accountslen ? accountslen : 500 };

            if (!this.accounts || this.accounts.length == 0)
                this.dataProvider.getAccountList(true, pager, false, true).subscribe(
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
            /*if (!this.simple)
                setTimeout(() => {
                this.dataProvider.getAccountList(true, pager).subscribe(
                    data => {
                        this.accounts = data;
                        this.config.setCache("dashaccounts", data);
                    },
                    error => {
                        console.log(error || 'Server error');
                    }
                    );  
            }, 100);*/
        }

        if (!this.ticketProvider._dataStore.tech.length){
            this.ticketProvider.getTicketsList("tech", "", "",{ "limit": 6 }); 
        }

        this.timer = setTimeout(() => {
            if (!this.ticketProvider._dataStore.user.length) {
                this.ticketProvider.getTicketsList("user", "", "",{ "limit": 6 });
            }
            if (this.config.current.is_time_tracking && !(this.timeProvider._dataStore["time"] || {}).length){
                this.timeProvider.getTimelogs("0", "", { "limit": 25 });
           }
        }, 2500);
    
        if (this.config.current.is_time_tracking){
                let date = new Date().toJSON().substring(0,10);
                let account = "0";
                this.cachename = addp("time", "account", account);
                this.cachename = addp(this.cachename, "tech", this.config.current.user.user_id);
                this.cachename = addp(this.cachename, "start_date", date);
                this.cachename = addp(this.cachename, "end_date", date);
                this.countHours(this.timeProvider._dataStore[this.cachename] || []);
                this.timeProvider.getTimelogs(account, this.config.current.user.user_id, { "limit": 25 }, date, date);
                this.timelogs = this.timeProvider.times$[this.cachename];
                this.timelogs.takeUntil(this.unsubscribe$).subscribe(
                        data => this.countHours(data)
                        );
         }
    }

    countHours(data){
        let non_working_hours = 0;
                            let working = 0;
                            data.forEach(item => {
                                 working += item.hours;
                                 if (item.non_working_hours != -1)
                                     non_working_hours += item.non_working_hours;
                            });
                            this.non_working_hours = non_working_hours;
                            this.working = working;
    }

    onPageDidEnter()
    {
        this.term = "";
    }

    itemTapped(event) {
         let tech = { tech_id: this.config.current.user.user_id, tech_name: this.config.current.user.firstname+" "+this.config.current.user.lastname };
         this.nav.push(TimelogsPage, tech);
                   }

    setDate(date, showmonth?, istime?) {
        return date ? getDateTime(date, showmonth, istime) : null;
    }
                   
    saveCache(){
        let el = document.elementFromPoint(window.innerWidth/2, window.innerHeight/2);
        let content = el.closest('ion-nav');
        if (content){
            window.dash = content.innerHTML.replace(/\s\s+/g,' ');
        }
    }

    ngOnDestroy(){  
        this.unsubscribe$.next();
        this.unsubscribe$.complete();   
        clearTimeout(this.timer);  
    }


    searchItems(searchbar) {}
    /* 
       // Reset items back to all of the items
        this.search_results = [];

        // set q to the value of the searchbar
        var q = searchbar.value;

        // if the value is an empty string don't filter the search_results
        if (q.trim() == '' || this.busy) {
            return;
        }

        if (q.length > 1)
        {
            var timer = setTimeout(() => { this.busy = true; }, 500);
            this.getItems(q, timer);
        }
    }*/

    getItems(term, timer) {
        this.search_results = [];
        let url = "tickets?query=all"; //status=allopen&
        let pager = { limit: 3 };
        let is_ticket = term[term.length - 1] == " " || term[term.length - 1] == ",";
        if (!is_ticket) term += "*";
        else url = "tickets/" + term.trim() + ",";
        this.apiData.getPaged(addp(url, "search", term), pager).subscribe(
            data => {
                if (timer) {
                    clearTimeout(timer);
                    this.busy = false;
                }
                this.search_results = data;
            },
            error => {
                if (timer) {
                    clearTimeout(timer);
                    this.busy = false;
                }
                console.log(error || 'Server error');
            }
            );
    }

    gotoTicket(ticket, searchBar)
    {
        this.test = false;
        this.clearSearch();
        this.nav.push(TicketDetailsPage, ticket);
    }

    clearSearch(searchbar?)
    {
        this.search_results = [];
        this.busy = false;
        if (searchbar) searchbar.value = "";
    }

    getSearch(searchbar) {
        this.test = false;
        //this.clearSearch();
        // Reset items back to all of the items
        // set q to the value of the searchbar
        //if (searchbar.target.value.trim().length > 2) {
            let term = searchbar.target.value;
            searchbar.value = "";
            console.log(searchbar.value);
            if (term.length < 4)
                term += "    ";
            let list = { search: term };
            this.test = false;
            this.nav.push(AjaxSearchPage, list);
            //}
        }

        itemTappedTL(tab) {  
            this.nav.setRoot(TicketsPage, tab);
        }

        itemTappedAD() {this.nav.setRoot(AccountDetailsPage);}

    }
