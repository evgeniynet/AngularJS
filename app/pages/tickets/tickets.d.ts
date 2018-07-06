import { Config, Nav, NavParams } from 'ionic-angular';
import { ApiData, TicketProvider } from '../../providers/providers';
export declare class TicketsPage {
    private nav;
    private navParams;
    private config;
    private apiData;
    private ticketProvider;
    counts: any;
    is_tech: boolean;
    ticket_tab: string;
    term: string;
    test: boolean;
    search_results: any;
    busy: boolean;
    constructor(nav: Nav, navParams: NavParams, config: Config, apiData: ApiData, ticketProvider: TicketProvider);
    onPageLoaded(): void;
    onPageDidEnter(): void;
    addTicket(): void;
    gotoTicket(data: any): void;
    searchItems(searchbar: any): void;
    getItems(term: any, timer: any): void;
    clearSearch(searchbar?: any): void;
    getSearch(searchbar: any): void;
}
