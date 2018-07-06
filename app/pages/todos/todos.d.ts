import { Config, Nav, NavParams } from 'ionic-angular';
export declare class TodosPage {
    private nav;
    private config;
    private navParams;
    is_empty: boolean;
    params: any;
    constructor(nav: Nav, config: Config, navParams: NavParams);
    onPageLoaded(): void;
    AddTodo(): void;
}
