import { Nav, NavParams, ViewController } from 'ionic-angular';
export declare class BasicSelectModal {
    private nav;
    private params;
    private viewCtrl;
    items: Array<any>;
    name: string;
    searchQuery: string;
    data: any;
    is_empty: boolean;
    isdefault_enabled: boolean;
    isnew_enabled: boolean;
    constructor(nav: Nav, params: NavParams, viewCtrl: ViewController);
    dismiss(item: any): void;
    invite(): void;
    getItems(searchbar: any): void;
}
