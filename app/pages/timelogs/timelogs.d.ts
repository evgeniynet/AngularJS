import { Config, Nav, NavParams, ViewController } from 'ionic-angular';
import { TimeProvider } from '../../providers/time-provider';
export declare class TimelogsPage {
    private nav;
    private timeProvider;
    private config;
    private navParams;
    private view;
    LIMIT: number;
    account: any;
    is_empty: boolean;
    params: any;
    pager: any;
    cachelen: number;
    cachename: string;
    timelogs: any;
    busy: boolean;
    initial_load: boolean;
    constructor(nav: Nav, timeProvider: TimeProvider, config: Config, navParams: NavParams, view: ViewController);
    onPageLoaded(): void;
    getTimeLogs(): void;
    onPageWillEnter(): void;
    doInfinite(infiniteScroll: any): void;
    itemTapped(time: any): void;
    setDate(date: any, showmonth?: any, istime?: any): any;
    getFixed(value: any): string;
}
