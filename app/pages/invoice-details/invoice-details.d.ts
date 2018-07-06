import { Config, Nav, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { ApiData } from '../../providers/api-data';
export declare class InvoiceDetailsPage {
    private nav;
    private navParams;
    private dataProvider;
    private apiData;
    private config;
    private view;
    invoice: any;
    title: string;
    constructor(nav: Nav, navParams: NavParams, dataProvider: DataProvider, apiData: ApiData, config: Config, view: ViewController);
    onPageLoaded(): void;
    onPageWillEnter(): void;
    setDate(date: any, showmonth?: any, istime?: any): any;
    getCurrency(value: any): string;
    changeContact(recipient: any): void;
    send(): void;
}
