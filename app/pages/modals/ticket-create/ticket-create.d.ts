import { Config, Nav, NavParams, ViewController } from 'ionic-angular';
import { TicketProvider } from '../../../providers/providers';
export declare class TicketCreatePage {
    private nav;
    private navParams;
    private ticketProvider;
    private config;
    private viewCtrl;
    private uploadComponent;
    data: any;
    ticket: any;
    he: any;
    selects: any;
    fileDest: any;
    files: any;
    constructor(nav: Nav, navParams: NavParams, ticketProvider: TicketProvider, config: Config, viewCtrl: ViewController);
    ngOnInit(): void;
    dismissPage(data: any): void;
    saveSelect(event: any): void;
    uploadedFile(event: any): void;
    selectedFile(event: any): void;
    onSubmit(form: any): void;
}
