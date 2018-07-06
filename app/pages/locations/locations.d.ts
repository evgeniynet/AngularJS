import { Config, Nav } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { ApiData, TicketProvider } from '../../providers/providers';
export declare class LocationsPage {
    private nav;
    private config;
    private dataProvider;
    private apiData;
    private ticketProvider;
    count: number;
    busy: boolean;
    params: any;
    pager: any;
    items: any;
    data: any;
    LIMIT: number;
    test: boolean;
    term: string;
    date: any;
    is_empty: boolean;
    constructor(nav: Nav, config: Config, dataProvider: DataProvider, apiData: ApiData, ticketProvider: TicketProvider);
    onPageLoaded(): void;
    searchItems(searchbar: any): void;
    getItems(term: any, infiniteScroll: any, timer?: any): void;
    doInfinite(infiniteScroll: any): void;
    clearSearch(searchbar?: any): void;
    gotoTicket(data: any): void;
}
