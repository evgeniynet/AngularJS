import { Config, Nav, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from '../../../providers/data-provider';
export declare class AddFilesModal {
    private nav;
    private navParams;
    private dataProvider;
    private config;
    private viewCtrl;
    ispassword: boolean;
    data: any;
    firstname_m: string;
    constructor(nav: Nav, navParams: NavParams, dataProvider: DataProvider, config: Config, viewCtrl: ViewController);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    dismissPage(data: any): void;
    onSubmit(form: any): void;
}
