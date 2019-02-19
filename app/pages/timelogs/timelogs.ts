import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {FORM_DIRECTIVES, Validators} from '@angular/common';
import {TimeProvider} from '../../providers/time-provider';
import {addp} from '../../directives/helpers';
import {TimelogPage} from '../timelog/timelog';
import {ActionButtonComponent} from '../../components/action-button/action-button';
import {SelectListComponent} from '../../components/select-list/select-list';
import {getDateTime} from '../../directives/helpers';
import {GravatarPipe, MorePipe, LinebreaksPipe} from '../../pipes/pipes';

@Page({
    templateUrl: 'build/pages/timelogs/timelogs.html',
    directives: [forwardRef(() => SelectListComponent), ActionButtonComponent],
    pipes: [GravatarPipe, MorePipe, LinebreaksPipe],
})
export class TimelogsPage {

    LIMIT: number = 25;
    account: any;
    selects: any;
    is_empty: boolean = false;
    params: any;
    pager: any;
    cachelen: number;
    cachename: string;
    timelogs: any;
    busy: boolean;
    test: boolean;
    initial_load: boolean = true;


    constructor(private nav: Nav, private timeProvider: TimeProvider, private config: Config, private navParams: NavParams, private view: ViewController) {
        this.pager = { page: 0, limit: this.LIMIT };
    }
    
    onPageLoaded()
    {
        this.params = this.navParams.data || {};
        console.log(this.params, "this.params");
        this.pager = { page: 0 };
        this.params.account = { id: this.params.account_id || -1, name: this.params.account_name || "" };
        this.params.tech = { id: this.params.tech_id || 0, name: this.params.tech_name || "" };
        let recent : any = {};

        this.selects = {
            "tech" : {
                name: "Tech", 
                value: this.params.tech.id==0? "--All " +this.config.current.names.tech.p+" --": this.params.tech.name,
                default: "--All " +this.config.current.names.tech.p+" --",
                isnew_disabled: true,
                selected: (this.params.tech || {}).id || 0,
                url: "technicians",
                hidden: false
            },
            "account" : {
                name: "Account", 
                value:  "--All " +this.config.current.names.account.p+" --",
                default: "--All " +this.config.current.names.account.p+" --",
                selected:  (this.params.account || {}).id || -1,
                url: "accounts?is_with_statistics=false",
                hidden: false
            }
        };
        console.log(this.selects.tech.default);
        if (!this.params.account)
        {
                recent = this.config.current.recent || {};
        }

        this.cachename = addp("time", "account", this.params.account.id);
        this.cachename = addp(this.cachename, "tech", this.params.tech.id);
        this.cachelen = (this.timeProvider._dataStore[this.cachename] || {}).length;

        if (this.params.is_empty)
            this.params.count = 0;

        if (this.params.count !== 0) {
            this.getTimeLogs();
        }
        else{
            this.is_empty = true;
        }

    }

    saveSelect(event){
        let name = event.type;
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
        this.params[name].id = event.id;
        this.cachename = addp("time", "account", this.params.account.id);
        this.cachename = addp(this.cachename, "tech", this.params.tech.id);
        this.cachelen = (this.timeProvider._dataStore[this.cachename] || {}).length;
        this.getTimeLogs();
    }

    getTimeLogs()
    {
        //let account_id
        //if (this.selects.account.selected == -1) 
//account_id = this.params.account.id;
        //else
        //    account_id = this.selects.account.selected;
    
        this.timeProvider.getTimelogs(this.params.account.id, this.params.tech.id, this.pager);
        this.timelogs = this.timeProvider.times$[this.cachename];
        if (!this.cachelen)
        {
            var timer = setTimeout(() => {
                this.busy = true;
            }, 500);
            setTimeout(() => {
                this.busy = false;
            }, 10000);
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
            }, 4000);
        }
        this.initial_load = false;
    }

    doInfinite(infiniteScroll) {
        if (this.is_empty || (this.cachelen > 0 && (this.cachelen >= this.params.count || this.cachelen < this.LIMIT)) || (this.params.count > 0 && (this.params.count < this.LIMIT))) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        let cachedlen = (this.timeProvider._dataStore[this.cachename] || {}).length;
        this.timeProvider.getTimelogs(this.params.account.id, this.selects.tech.selected, this.pager);
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
        //date = new Date(date.substring(0,23)+"Z");
        //date = new Date(date.setTime(date.getTime() + time_offset*60*60*1000)).toJSON();
        return getDateTime(date, showmonth, istime);
    }
     return null;
    }

    getFixed(value){
        return Number(value || "0").toFixed(2).toString();
    }
    toggle(){
        this.test = !this.test;
        if (this.test){
            setTimeout(() => {
        let t = document.getElementsByClassName("open-filter");
        t = t[t.length - 1];
        t && t.focus();
        }, 500);
        }
    }
}
