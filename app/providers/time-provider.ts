import {Injectable} from '@angular/core';
import {Config, Events} from 'ionic-angular';
import {dontClearCache} from './config';
import {Headers, Http} from '@angular/http';
import {Observable, Observer} from 'rxjs';
import {ApiData} from './api-data';
import {addp} from '../directives/helpers';
import 'rxjs';
import {MOCKS} from './mocks';

@Injectable()
export class TimeProvider {

    URL: string = "time";
    times$: Object; //Array<Observable<Object[]>>;
    private _timesObserver: Object; //Array<Observer<Object[]>>;
    _dataStore: any;

    constructor(private apiData: ApiData, private config: Config, private events: Events) {
        this.times$ = {}; //new Observable(observer => this._timesObserver = observer).share();
        this._timesObserver = {};
        this._dataStore = {};
     }

    getTimelogs(account_id, tech_id,  pager, start?, end?) {
        let url = addp(this.URL, "account", account_id);
        url = addp(url, "tech", tech_id);
        url = addp(url, "start_date", start);
        url = addp(url, "end_date", end);
        pager.limit = pager.limit || 25;
        pager.page = pager.page || 0;
        this._dataStore[url] = this._dataStore[url] || [];
        if (dontClearCache) {
            this.times$[url] = new Observable(observer => this._timesObserver[url] = observer).share();
            this._dataStore[url] = MOCKS["time"];
        }
        let cachelen = this._dataStore[url].length;
        if (pager.page == 0) {
            pager.limit = Math.max(cachelen, pager.limit);
            if (cachelen) {
                setTimeout(() => {
                    if (this._timesObserver[url])
                        this._timesObserver[url].next(this._dataStore[url] || []);
                }, 0);
            }
            else {
                this.times$[url] = new Observable(observer => this._timesObserver[url] = observer).share();
            }

        }
        this.apiData.getPaged(url, pager).subscribe(data => {
            if (pager.page > 0  && cachelen > 0)
                this._dataStore[url].push(...data);
            else
                this._dataStore[url] = data;
            if (this._timesObserver[url])
                this._timesObserver[url].next(this._dataStore[url]);
        }, error => console.log('Could not load timelogs.'));
        return cachelen;
    }

        addTime(id, data, method) {
            let url = this.URL + (!id ? "" : ("/" + id));
            return this.apiData.get(url, data, method);
        }
    }