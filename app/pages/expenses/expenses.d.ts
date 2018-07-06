import { Config, Nav, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
export declare class ExpensesPage {
    private nav;
    private dataProvider;
    private config;
    private navParams;
    private view;
    LIMIT: number;
    count: number;
    account: Object;
    is_empty: boolean;
    busy: boolean;
    params: any;
    pager: any;
    expenses: Array<any>;
    constructor(nav: Nav, dataProvider: DataProvider, config: Config, navParams: NavParams, view: ViewController);
    onPageLoaded(): void;
    onPageWillEnter(): void;
    getItems(infiniteScroll: any, timer: any): void;
    doInfinite(infiniteScroll: any): void;
    itemTapped(expense: any): void;
    setDate(date: any, showmonth?: any, istime?: any): any;
    getCurrency(value: any): string;
}
