import { Nav } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
export declare class SkypePage {
    private nav;
    private dataProvider;
    is_skype_done: boolean;
    constructor(nav: Nav, dataProvider: DataProvider);
    onPageLoaded(): void;
    onLoginSkype(): void;
    cancel_skype(): void;
}
