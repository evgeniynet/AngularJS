import { Nav, Config } from 'ionic-angular';
export declare class TechniciansListComponent {
    private nav;
    private config;
    technicians: Array<any>;
    simple: boolean;
    is_empty: boolean;
    constructor(nav: Nav, config: Config);
    itemTapped(event: any, account: any): void;
    goToTechTicketsPage(technician: any): void;
    ngOnChanges(event: any): void;
}
