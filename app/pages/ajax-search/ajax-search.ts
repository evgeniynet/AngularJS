import {Nav, NavParams, Page, Config} from 'ionic-angular';
import {ApiData, TicketProvider} from '../../providers/providers';
import {getFullName, addp} from '../../directives/helpers';
import {TicketDetailsPage} from '../ticket-details/ticket-details';
import {Focuser} from '../../directives/directives';
import {Control} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import {URLSearchParams, Jsonp} from '@angular/http';

@Page({
    templateUrl: 'build/pages/ajax-search/ajax-search.html',
    directives: [Focuser],
})
export class AjaxSearchPage {

    url: string;
    term: string;
    search: string;
    name: string;
    data: any = [];
    items: any = [];
    pager: any;
    count: number;
    is_empty: boolean = false;
    busy: boolean;

    constructor(private nav: Nav, private navParams: NavParams, private config: Config, private apiData: ApiData, private ticketProvider: TicketProvider) {
    }

    ngOnInit() {
        this.term = this.navParams.data.search || "";
        /*
        this.name = this.navParams.data.name || "List";
        this.url = this.navParams.data.url || "";
        this.data = this.navParams.data.items || {};
        */
        this.pager = { limit: 20 };
        if (this.ticketProvider._dataStore.all.length)
            this.data = this.ticketProvider._dataStore.all;
        else if (this.ticketProvider._dataStore.tech.length)
            this.data = this.ticketProvider._dataStore.tech;
        else if (this.ticketProvider._dataStore.user.length)
            this.data = this.ticketProvider._dataStore.user;
        let q = this.term.toLowerCase();
        if (this.data.length && q.length < 4){
            this.items = this.data.filter((v) => this.searchCriteria(v, q));
        }
        this.count = this.items.length;
        if (q.length > 3) {
            var timer = setTimeout(() => {
                this.is_empty = true;
                this.busy = true;
            }, 500);

            this.getItems(q, timer);
        }
        else
            this.is_empty = !this.items.length;
    }

    dismiss(ticket)
    {
        this.nav.push(TicketDetailsPage, ticket);
    }

    searchCriteria (ticket, term)
    {
        return ticket.number.toString().indexOf(term) > -1
            || ticket.subject.toLowerCase().indexOf(term) > -1
            || ticket.initial_post.toLowerCase().indexOf(term) > -1
            || ticket.user_firstname.toLowerCase().indexOf(term) > -1
            || ticket.user_lastname.toLowerCase().indexOf(term) > -1
            || ticket.location_name.toLowerCase().indexOf(term) > -1
            || ticket.class_name.toLowerCase().indexOf(term) > -1
    }

    searchItems(searchbar) {
        // Reset items back to all of the items
        this.items = this.data;

        // set q to the value of the searchbar
        var q = searchbar.value;

        // if the value is an empty string don't filter the items
        if (q.trim() == '' || this.busy) {
            if (q.trim() == '') this.is_empty = !this.items.length;
            return;
        }

        if (q.length < 4)
        {
        this.items = this.data.filter((v) => this.searchCriteria(v, q));
                this.is_empty = !this.items.length;
        }
        else {
            var timer = setTimeout(() => { this.busy = true; }, 500);
            this.getItems(q, timer);
        }
    }

    getItems(term, timer) {
        this.items = [];
        this.url = "tickets?status=allopen&query=all";
        this.apiData.getPaged(addp(this.url, "search", term+"*"), this.pager).subscribe(
            data => {
                if (timer) {
                    clearTimeout(timer);
                    this.busy = false;
                }
                this.is_empty = !data.length;

                if (!term)
                {
                    this.items = this.data = data;
                }
                else
                    this.items = data;

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
}