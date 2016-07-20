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
    busy: boolean;


    constructor(private nav: Nav, private timeProvider: TimeProvider, private config: Config, private navParams: NavParams, private view: ViewController) {
        this.pager = { page: 0, limit: this.LIMIT };
  }
    
    onPageLoaded()
    {
        this.params = this.navParams.data || {};
        this.pager = { page: 0 };
        this.params.account = { id: this.params.account_id || "", name: this.params.account_name || this.config.getCurrent("user").account_name };

        this.cachename = addp("time", "account", this.params.account.id);
        this.cachelen = (this.timeProvider._dataStore[this.cachename] || {}).length;

        if (this.params.is_empty)
            this.params.count = 0;

        if (this.params.count !== 0) {
            this.timeProvider.getTimelogs(this.params.account.id, this.pager);
            this.timelogs = this.timeProvider.times$[this.cachename];
            if (!this.cachelen)
            {
                var timer = setTimeout(() => {
                    this.busy = true;
                }, 500);
                this.timelogs.subscribe(
                    data => {
                        clearTimeout(timer);
                        this.busy = false;
                        this.is_empty = !data.length;
                    });
            }
        }
        else
            this.is_empty = true;
    }

    onPageWillEnter() {
        if (this.params.account_name)
            this.view.setBackButtonText('');
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
        this.nav.push(TimelogPage, time);
    }
    
    setDate(date, showmonth?, istime?) {
        return date ? getDateTime(date, showmonth, istime) : null;
    }

    getFixed(value){
        return Number(value || "0").toFixed(2).toString();
    }
}
