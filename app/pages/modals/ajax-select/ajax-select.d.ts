import { Nav, NavParams, Config, ViewController } from 'ionic-angular';
import { ApiData } from '../../../providers/api-data';
export declare class AjaxSelectModal {
    private nav;
    private navParams;
    private config;
    private apiData;
    private viewCtrl;
    items: any;
    url: string;
    term: string;
    name: string;
    data: any;
    pager: any;
    count: number;
    is_empty: boolean;
    busy: boolean;
    isdefault_enabled: boolean;
    isnew_enabled: boolean;
    constructor(nav: Nav, navParams: NavParams, config: Config, apiData: ApiData, viewCtrl: ViewController);
    ngOnInit(): void;
    dismiss(item: any): void;
    invite(): void;
    searchItems(searchbar: any): void;
    getItems(term: any, timer: any): void;
}
