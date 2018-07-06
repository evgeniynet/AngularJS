import { Config, Nav, NavParams, ViewController } from 'ionic-angular';
export declare class TechTicketsPage {
    private nav;
    private navParams;
    private view;
    private config;
    technician: any;
    constructor(nav: Nav, navParams: NavParams, view: ViewController, config: Config);
    onPageWillEnter(): void;
    addTicket(): void;
}
