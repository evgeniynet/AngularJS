import { Config, Nav, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
export declare class InvoicesPage {
    private nav;
    private dataProvider;
    private config;
    private navParams;
    private view;
    LIMIT: number;
    count: number;
    account: any;
    is_empty: boolean;
    busy: boolean;
    params: any;
    pager: any;
    invoices: Array<any>;
    constructor(nav: Nav, dataProvider: DataProvider, config: Config, navParams: NavParams, view: ViewController);
    onPageLoaded(): void;
    onPageWillEnter(): void;
    getItems(infiniteScroll: any, timer: any): void;
    doInfinite(infiniteScroll: any): void;
    itemTapped(item: any): void;
    showUninvoiced(): void;
    setDate(date: any, showmonth?: any, istime?: any): any;
    getCurrency(value: any): string;
}
