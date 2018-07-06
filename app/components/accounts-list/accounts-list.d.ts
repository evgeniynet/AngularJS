import { Nav, Config } from 'ionic-angular';
export declare class AccountsListComponent {
    private nav;
    private config;
    accounts: Array<any>;
    simple: boolean;
    is_empty: boolean;
    constructor(nav: Nav, config: Config);
    itemTapped(event: any, account: any): void;
    ngOnChanges(event: any): void;
}
