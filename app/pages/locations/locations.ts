import {Page, Config, Nav} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {LocationsListComponent, ActionButtonComponent} from '../../components/components';
import {AjaxSearchPage} from '../ajax-search/ajax-search';
import {ApiData, TicketProvider} from '../../providers/providers';
import {addp} from '../../directives/helpers';
import {TicketDetailsPage} from '../ticket-details/ticket-details';


@Page({
  templateUrl: 'build/pages/locations/locations.html',
    directives: [LocationsListComponent, ActionButtonComponent],
})
export class LocationsPage {

    count: number;
    is_empty: boolean;
    busy: boolean;
    params: any;
    pager: any;
    locations: Array<any>;
    LIMIT: number = 500;
    search_results: any;
    test: boolean;
    term: string = '';

    constructor(private nav: Nav, private config: Config, private dataProvider: DataProvider, private apiData: ApiData, private ticketProvider: TicketProvider) {
  }
    
    onPageLoaded()
    {
        this.pager = { page: 0, limit: this.LIMIT };

        var timer = setTimeout(() => {
            this.busy = true;
        }, 500);

        this.getItems(null, timer);
    }


    getItems(infiniteScroll, timer) {
        this.dataProvider.getLocationList(this.pager, true).subscribe(
            data => {
                //console.log(data);
                if (timer) {
                    clearTimeout(timer);
                    this.busy = false;
                    this.locations = data;
                    //this.config.setStat("accounts", data.length);
                }
                else
                {
                    this.locations.push(...data);
                    //TODO: how do get accounts stat
                    this.config.current.stat.locations += data.length;
                }
                if (infiniteScroll) {
                    infiniteScroll.enable(data.length == this.LIMIT);
                    infiniteScroll.complete();
                }
                this.count = data.length;
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

    doInfinite(infiniteScroll) {
        if (this.count < this.LIMIT) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        this.getItems(infiniteScroll, null);
    }
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
            this.searchItemsAPI(q, timer);
        }
    }

     searchItemsAPI(term, timer) {
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
        this.clearSearch();
        // Reset items back to all of the items
        // set q to the value of the searchbar
        let term = searchbar.target.value;
        if (term.length < 4)
            term += "    ";
        let list = { search: term };
        this.test = false;
        this.nav.push(AjaxSearchPage, list);
    }

        gotoTicket(data)
    {
        this.test = false;
        this.clearSearch();
        if (data)
        {
            this.ticketProvider.getTicketsList("", "", "",{ "limit": 25 });
            setTimeout(() => {
                this.nav.push(TicketDetailsPage, data);
            //if (!this.counts[this.ticket_tab])
            //    this.counts = {};
            //this.counts[this.ticket_tab] = (this.ticketProvider._dataStore[this.ticket_tab] || {}).length++;
            }, 500);
        }
    }
}
