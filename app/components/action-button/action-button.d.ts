import { Nav, NavParams, Config } from 'ionic-angular';
export declare class ActionButtonComponent {
    private navParams;
    private nav;
    private config;
    data: any;
    actionSheet: any;
    constructor(navParams: NavParams, nav: Nav, config: Config);
    ngOnInit(): void;
    openModal(page: any): void;
    presentActionSheet(): void;
}
