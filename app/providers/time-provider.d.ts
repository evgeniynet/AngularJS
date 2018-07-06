import { Config, Events } from 'ionic-angular';
import { ApiData } from './api-data';
import 'rxjs';
export declare class TimeProvider {
    private apiData;
    private config;
    private events;
    URL: string;
    times$: Object;
    private _timesObserver;
    _dataStore: any;
    constructor(apiData: ApiData, config: Config, events: Events);
    getTimelogs(account_id: any, pager: any): any;
    addTime(id: any, data: any, method: any): any;
}
