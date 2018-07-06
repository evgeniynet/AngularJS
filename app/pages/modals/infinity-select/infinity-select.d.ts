import { Nav, NavParams, Config, ViewController } from 'ionic-angular';
import { ApiData } from '../../../providers/api-data';
export declare class InfinitySelectModal {
    private nav;
    private navParams;
    private config;
    private apiData;
    private viewCtrl;
    items: any;
    url: string;
    name: string;
    term: string;
    data: any;
    count: number;
    is_empty: boolean;
    busy: boolean;
    pager: any;
    isbutton: boolean;
    isdefault_enabled: boolean;
    isnew_enabled: boolean;
    date: any;
    constructor(nav: Nav, navParams: NavParams, config: Config, apiData: ApiData, viewCtrl: ViewController);
    ngOnInit(): void;
    dismiss(item: any): void;
    invite(): void;
    searchItems(searchbar: any): void;
    getItems(term: any, infiniteScroll: any, timer?: any): void;
    doInfinite(infiniteScroll: any): void;
}
