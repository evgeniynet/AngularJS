import { Nav, NavParams, Config } from 'ionic-angular';
import { ApiData, TicketProvider } from '../../providers/providers';
export declare class AjaxSearchPage {
    private nav;
    private navParams;
    private config;
    private apiData;
    private ticketProvider;
    url: string;
    term: string;
    location: any;
    search: string;
    name: string;
    data: any;
    items: any;
    pager: any;
    count: number;
    is_empty: boolean;
    busy: boolean;
    constructor(nav: Nav, navParams: NavParams, config: Config, apiData: ApiData, ticketProvider: TicketProvider);
    ngOnInit(): void;
    dismiss(ticket: any): void;
    searchCriteria(ticket: any, term: any): boolean;
    searchItems(searchbar: any): void;
    getItems(term: any, timer: any): void;
}
