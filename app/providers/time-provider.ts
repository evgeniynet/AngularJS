import {Injectable} from 'angular2/core';
import {Config, Events} from 'ionic-angular';
import {dontClearCache} from './config';
import {Headers, Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {ApiData} from './api-data';
import {addp} from '../directives/helpers';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import {MOCKS} from './mocks';

@Injectable()
export class TimeProvider {

    times$: Object; //Array<Observable<Object[]>>;
    private _timesObserver: Object; //Array<Observer<Object[]>>;
    _dataStore: any;

    constructor(private apiData: ApiData, private config: Config, private events: Events) {
        this.times$ = {}; //new Observable(observer => this._timesObserver = observer).share();
        this._timesObserver = {};
        this._dataStore = {};
     }

    getTimelogs(account_id, pager) {
        let url = addp("time", "account", account_id);
        return this.apiData.getPaged(url, pager);
    }

    getTimesList(tab, id, pager) {
        //"user","tech","alt","all"
        let url = "";
        switch (tab.toString()) {
            case "tech":
                url = "tickets?status=open&role=tech";
                break;
            case "all":
                url = "tickets?status=allopen&query=all";
                break;
            case "alt":
                url = "tickets?status=open&role=alt_tech";
                break;
            case "open":
                url = "tickets?status=open&account=" + id;
                break;
            case "closed":
                url = "tickets?status=closed&account=" + id;
                break;
            case 'queue':
                url = "queues/" + id;
                break;
            default:
                //case "user":
                url = "tickets?status=open,onhold&role=user";
                break;
        }
        pager.limit = pager.limit || 25;
        pager.page = pager.page || 0;
        tab += id || "";
        this._dataStore[tab] = this._dataStore[tab] || [];
        if (dontClearCache) {
            this.times$[tab] = new Observable(observer => this._timesObserver[tab] = observer).share();
            this._dataStore[tab] = MOCKS["times"];
        }
        let cachelen = this._dataStore[tab].length;
        if (pager.page == 0) {
            pager.limit = cachelen || pager.limit;
            if (cachelen) {
                setTimeout(() => {
                    if (this._timesObserver[tab])
                        this._timesObserver[tab].next(this._dataStore[tab] || []);
                }, 0);
            }
            else {
                this.times$[tab] = new Observable(observer => this._timesObserver[tab] = observer).share();
            }

        }
        this.apiData.getPaged(url, pager).subscribe(data => {
            if (pager.page > 0)
                this._dataStore[tab].push(...data);
            else
                this._dataStore[tab] = data;
            if (this._timesObserver[tab])
                this._timesObserver[tab].next(this._dataStore[tab]);
            //if (data.length < pager.limit)
            // add flag that data completed
        }, error => console.log('Could not load times.'));
        return cachelen;
    }

        addTime(id, data, method) {
            let url = "time" + (!id ? "" : ("/" + id));
            return this.apiData.get(url, data, method);
        }
    }