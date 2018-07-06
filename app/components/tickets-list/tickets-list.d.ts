import { Nav, NavParams, Config } from 'ionic-angular';
import { TicketProvider } from '../../providers/ticket-provider';
export declare class TicketsListComponent {
    private nav;
    private navParams;
    private config;
    private ticketProvider;
    LIMIT: number;
    mode: Array<any>;
    count: number;
    preload: number;
    filter: string;
    tickets: any;
    cachelen: number;
    cachename: string;
    pager: any;
    is_empty: boolean;
    busy: boolean;
    he: any;
    constructor(nav: Nav, navParams: NavParams, config: Config, ticketProvider: TicketProvider);
    ngOnChanges(event: any): void;
    ngOnInit(): void;
    onLoad(): void;
    itemTapped(event: any, ticket: any, slidingItem: any): void;
    addPost(ticket: any, slidingItem: any): void;
    closeTicket(ticket: any, slidingItem: any): void;
    reopenTicket(ticket: any): void;
    doInfinite(infiniteScroll: any): void;
}
