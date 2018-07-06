import { Nav, NavParams, ViewController, Config } from 'ionic-angular';
import { TicketProvider } from '../../../providers/ticket-provider';
import { ApiData } from '../../../providers/api-data';
export declare class CloseTicketModal {
    private nav;
    private navParams;
    private apiData;
    private ticketProvider;
    private config;
    private viewCtrl;
    isconfirm: boolean;
    ticketnote: string;
    ticket: any;
    selects: any;
    categories: any;
    constructor(nav: Nav, navParams: NavParams, apiData: ApiData, ticketProvider: TicketProvider, config: Config, viewCtrl: ViewController);
    ngOnInit(): void;
    dismiss(num?: any): void;
    saveSelect(event: any): void;
    onSubmit(form: any): void;
}
