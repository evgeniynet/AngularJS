import { Config, Nav, NavParams, ViewController } from 'ionic-angular';
import { TicketProvider } from '../../providers/providers';
import { DataProvider } from '../../providers/data-provider';
export declare class AccountDetailsPage {
    private nav;
    private navParams;
    private dataProvider;
    private ticketProvider;
    private config;
    private view;
    account: any;
    pages: Array<any>;
    details_tab: string;
    tabsTicket: string;
    is_editnote: boolean;
    is_ready: boolean;
    constructor(nav: Nav, navParams: NavParams, dataProvider: DataProvider, ticketProvider: TicketProvider, config: Config, view: ViewController);
    onPageLoaded(): void;
    onPageWillEnter(): void;
    saveNote(form: any): void;
    saveNoteSuccess(note: any): void;
    onDelete(file: any): void;
    openPage(page: any, count: any): void;
    getFileLink(file: any): string;
    addFilesButton(): void;
}
