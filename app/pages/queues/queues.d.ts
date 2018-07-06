import { Nav } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
export declare class QueuesPage {
    private nav;
    private dataProvider;
    queues: any;
    constructor(nav: Nav, dataProvider: DataProvider);
    onPageLoaded(): void;
}
