import {Page, Config, Nav} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {LocationsListComponent, ActionButtonComponent} from '../../components/components';
import {ApiData, TicketProvider} from '../../providers/providers';
import {addp} from '../../directives/helpers';
import {TicketDetailsPage} from '../ticket-details/ticket-details';


@Page({
    templateUrl: 'build/pages/locations/locations.html',
    directives: [LocationsListComponent, ActionButtonComponent],
})
export class LocationsPage {

    count: number;
    busy: boolean;
    params: any;
    pager: any;
    search_results: any;
    items: any =[];
    data: any;
    LIMIT: number = 25;
    test: boolean;
    term: string = '';
    date: any;
    is_empty: boolean;

    constructor(private nav: Nav, private config: Config, private dataProvider: DataProvider, private apiData: ApiData, private ticketProvider: TicketProvider) {
    }
    
    onPageLoaded()
    {
        this.is_empty = true;
        this.pager = { page: 0, limit: this.LIMIT };

        var timer = setTimeout(() => {
            this.busy = true;
        }, 500);

        this.getItems("", null, timer);
    }

    searchItems(searchbar) {
            // Reset items back to all of the items
            this.items = this.data;

            // set q to the value of the searchbar
            var q = searchbar.value.trim();

            // if the value is an empty string don't filter the items
            if (q.trim() == '' || this.busy) {
                return;
            }

            this.date = Date.now();

            if (this.data && q.length > 1)
            {
            this.items = this.data.filter((data) => data.name.toLowerCase().indexOf(q) > -1);
            }
        }

        getItems(term, infiniteScroll, timer?) {
            let pager = { page: this.pager.page, limit: this.pager.limit };
            let sterm = term;
            if (term.length > 2)
            {
                pager.page = 0;
                //sterm = term+"*";
            }
            var url = "locations";
            this.apiData.getPaged(addp(url, "search", sterm), pager).subscribe(
                data => {
                    if (timer) {
                        this.is_empty = !data.length;
                        clearTimeout(timer);
                        this.busy = false;
                    }
                    this.count = 25;
                    if (!term || term.length < 3)
                    {
                        if (timer) {
                            this.data = data;
                        }
                        else 
                            this.data.push(...data);
                        if (infiniteScroll) {
                            infiniteScroll.enable(data.length == 25);
                        }
                        this.count = data.length;
                        this.searchItems({ value: term });
                    }
                    else if (data.length)
                        this.items = data;
                    else
                        this.items = this.data;
                    if (infiniteScroll) {
                        infiniteScroll.complete();
                    }
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
            if (this.date && Date.now() - this.date < 1000) {infiniteScroll.complete(); return;}
            if (this.is_empty || this.count < 25) {
                infiniteScroll.complete();
                if ((this.is_empty && !this.term) || this.count < 25)
                infiniteScroll.enable(false);
                return;
            }
            this.pager.page += 1;
            this.term = "";
            this.getItems("", infiniteScroll);
        }


    clearSearch(searchbar?)
    {
        this.search_results = [];
        this.busy = false;
        if (searchbar) searchbar.value = "";
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
