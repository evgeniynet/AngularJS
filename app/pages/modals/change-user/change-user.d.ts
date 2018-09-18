import { Nav, NavParams, ViewController, Config } from 'ionic-angular';
import { TicketProvider } from '../../../providers/ticket-provider';
export declare class ChangeUserModal {
    private nav;
    private navParams;
    private ticketProvider;
    private config;
    private viewCtrl;
    keep_attached: boolean;
    ticketnote: string;
    ticket: any;
    selects: any;
    constructor(nav: Nav, navParams: NavParams, ticketProvider: TicketProvider, config: Config, viewCtrl: ViewController);
    ngOnInit(): void;
    dismiss(data: any): void;
    saveSelect(event: any): void;
    onSubmit(form: any): void;
}
