import { Config, Nav } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
export declare class TechniciansPage {
    private nav;
    private config;
    private dataProvider;
    count: number;
    is_empty: boolean;
    busy: boolean;
    params: any;
    pager: any;
    technicians: Array<any>;
    LIMIT: number;
    constructor(nav: Nav, config: Config, dataProvider: DataProvider);
    onPageLoaded(): void;
    getItems(infiniteScroll: any, timer: any): void;
    doInfinite(infiniteScroll: any): void;
}
