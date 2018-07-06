import { Config, Nav, NavParams, ViewController } from 'ionic-angular';
export declare class QueueTicketsPage {
    private nav;
    private navParams;
    private view;
    private config;
    queue: any;
    constructor(nav: Nav, navParams: NavParams, view: ViewController, config: Config);
    onPageWillEnter(): void;
    addTicket(): void;
}
