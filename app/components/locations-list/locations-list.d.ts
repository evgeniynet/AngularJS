import { Nav, Config } from 'ionic-angular';
export declare class LocationsListComponent {
    private nav;
    private config;
    locations: Array<any>;
    simple: boolean;
    is_empty: boolean;
    constructor(nav: Nav, config: Config);
    itemTapped(event: any, location: any): void;
    ngOnChanges(event: any): void;
}
