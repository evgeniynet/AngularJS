import {Page, Config, Nav, NavParams, Modal} from 'ionic-angular';
import {ApiData, TicketProvider} from '../../providers/providers';
import {TicketCreatePage} from '../modals/modals'; 
import {TicketDetailsPage} from '../ticket-details/ticket-details';
import {AjaxSearchPage} from '../ajax-search/ajax-search';
import {TicketsListComponent} from '../../components/components';
import {Focuser} from '../../directives/directives';
import {addp} from '../../directives/helpers';

@Page({
    templateUrl: 'build/pages/tickets/tickets.html',
    directives: [TicketsListComponent, Focuser],
})
export class TicketsPage {

    counts: any;
    is_tech: boolean;
    ticket_tab: string;
    term: string = '';
    test: boolean;
    search_results: any;
    busy: boolean;
    user_id: string = '';

    
    constructor(private nav: Nav, private navParams: NavParams, private config: Config, private apiData: ApiData, private ticketProvider: TicketProvider) {
        this.counts = {};
    }
    
    onPageLoaded()
    {      
        this.user_id = this.config.getCurrent("user").user_id;
        this.is_tech = this.config.getCurrent("user").is_techoradmin;
        let param = this.navParams.data || {};
        if (param.count)
            this.counts[param.tab] = param.count;
        if (this.is_tech)
            this.ticket_tab = !param.tab ? "tech" : param.tab;
        else
            this.ticket_tab = "user";
        this.nav.tickets_tab = null;

        if (param.key){
            this.gotoTicket(param);
        }
    }

    onPageDidEnter()
    {
        this.term = "";
    }

    addTicket(){
        let myModal = Modal.create(TicketCreatePage);
        myModal.onDismiss(data1 => {
            this.gotoTicket(data1);
        });
        this.nav.present(myModal);
    }

    gotoTicket(data)
    {
        this.test = false;
        this.clearSearch();
        if (data)
        {
            this.ticketProvider.getTicketsList(this.ticket_tab, "", "",{ "limit": 25 });
            setTimeout(() => {
                this.nav.push(TicketDetailsPage, data);
            //if (!this.counts[this.ticket_tab])
            //    this.counts = {};
            //this.counts[this.ticket_tab] = (this.ticketProvider._dataStore[this.ticket_tab] || {}).length++;
            }, 500);
        }
    }

/*
    searchItems(searchbar) {
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
        let term = searchbar.target.value;
        searchbar.value = "";
        if (term.length < 4)
            term += "    ";
        let list = { search: term };
        this.test = false;
        this.nav.push(AjaxSearchPage, list);
    }

}
