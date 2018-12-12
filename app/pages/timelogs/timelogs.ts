import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {TimeProvider} from '../../providers/time-provider';
import {addp} from '../../directives/helpers';
import {TimelogPage} from '../timelog/timelog';
import {ActionButtonComponent} from '../../components/action-button/action-button';
import {getDateTime} from '../../directives/helpers';
import {GravatarPipe, MorePipe, LinebreaksPipe} from '../../pipes/pipes';

@Page({
    templateUrl: 'build/pages/timelogs/timelogs.html',
    directives: [ActionButtonComponent],
    pipes: [GravatarPipe, MorePipe, LinebreaksPipe],
})
export class TimelogsPage {

    LIMIT: number = 25;
    account: any;
    is_empty: boolean = false;
    params: any;
    pager: any;
    cachelen: number;
    cachename: string;
    timelogs: any;
    term: string = '';
    test: boolean;
    search_results: any;
    items: any = [];
    busy: boolean;
    initial_load: boolean = true;


    constructor(private nav: Nav, private timeProvider: TimeProvider, private config: Config, private navParams: NavParams, private view: ViewController) {
        this.pager = { page: 0, limit: this.LIMIT };
    }
    
    onPageLoaded()
    {
        this.params = this.navParams.data || {};
        this.pager = { page: 0 };
        this.params.account = { id: this.params.account_id || "", name: this.params.account_name || "" };

        this.cachename = addp("time", "account", this.params.account.id);
        this.cachelen = (this.timeProvider._dataStore[this.cachename] || {}).length;

        if (this.params.is_empty)
            this.params.count = 0;

        if (this.params.count !== 0) {
            this.getTimeLogs();
        }
        else
            this.is_empty = true;
    }

    getTimeLogs()
    {
        this.timeProvider.getTimelogs(this.params.account.id, this.pager);
        this.timelogs = this.timeProvider.times$[this.cachename];
        this.searchItems({value : this.term});
        if (!this.cachelen)
        {
            var timer = setTimeout(() => {
                this.busy = true;
            }, 500);
            setTimeout(() => {
                this.busy = false;
            }, 3000);
            this.timelogs.subscribe(
                data => {
                    clearTimeout(timer);
                    this.busy = false;
                    this.is_empty = !data.length;
                });
        }
    }

    onPageWillEnter() {
        if (this.params.account_name)
            this.view.setBackButtonText('');
        if (!this.initial_load)
        {
            setTimeout(() => {
               this.getTimeLogs();
            }, 2000);
        }
        this.initial_load = false;
    }

    searchItems(searchbar) {
        // Reset items back to all of the items
        this.items = this.timelogs;

        // set q to the value of the searchbar
        let q = searchbar.value.toLowerCase();

        // if the value is an empty string don't filter the search_results
        if (q.trim() == '' || this.busy) {
            return;
        }

        if (this.timelogs && q.length > 1)
        {
            this.items = this.timelogs.filter((time) => time.ticket_number.toLowerCase().indexOf(q) > -1
            || time.ticket_subject.toLowerCase().indexOf(q) > -1
            || time.note.toLowerCase().indexOf(q) > -1
            || time.user_firstname.toLowerCase().indexOf(q) > -1
            || time.user_lastname.toLowerCase().indexOf(q) > -1
            || time.contract_name.toLowerCase().indexOf(q) > -1
            || time.prepaid_pack_name.toLowerCase().indexOf(q) > -1);        }
    }

    clearSearch(searchbar?)
    {
        this.search_results = [];
        this.busy = false;
        if (searchbar) searchbar.value = "";
    }

    doInfinite(infiniteScroll) {
        if (this.is_empty || (this.cachelen > 0 && (this.cachelen >= this.params.count || this.cachelen < this.LIMIT)) || (this.params.count > 0 && (this.params.count < this.LIMIT))) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        let cachedlen = (this.timeProvider._dataStore[this.cachename] || {}).length;
        this.timeProvider.getTimelogs(this.params.account.id, this.pager);
        this.timelogs.subscribe(
            data => {
                infiniteScroll.complete();
                let len = data.length;
                infiniteScroll.enable(!(cachedlen == len || len % this.LIMIT));
                this.cachelen = len;
            });
    }
    
    itemTapped(time) {
        time = time || {};
        time.account = time.account || this.params.account;
        time.cachename = this.cachename;
        this.nav.push(TimelogPage, time);
    }
    
    setDate(date, time_offset, showmonth?, istime?) {
    if (date){
        date = new Date(date.substring(0,23)+"Z");
        date = new Date(date.setTime(date.getTime() + time_offset*60*60*1000)).toJSON();
        return getDateTime(date, showmonth, istime);
    }
     return null;
    }

    getFixed(value){
        return Number(value || "0").toFixed(2).toString();
    }
}
