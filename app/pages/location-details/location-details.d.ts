import { Config, Nav, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { ApiData, TicketProvider } from '../../providers/providers';
export declare class LocationDetailsPage {
    private nav;
    private navParams;
    private apiData;
    private dataProvider;
    private ticketProvider;
    private config;
    private view;
    location: any;
    pages: Array<any>;
    tabsTicket: string;
    is_ready: boolean;
    search_results: any;
    test: boolean;
    term: string;
    busy: boolean;
    constructor(nav: Nav, navParams: NavParams, apiData: ApiData, dataProvider: DataProvider, ticketProvider: TicketProvider, config: Config, view: ViewController);
    onPageLoaded(): void;
    onPageWillEnter(): void;
    addTicket(): void;
    gotoTicket(data: any): void;
    searchItems(searchbar: any): void;
    searchItemsAPI(term: any, timer: any): void;
    clearSearch(searchbar?: any): void;
    getSearch(searchbar: any): void;
}
