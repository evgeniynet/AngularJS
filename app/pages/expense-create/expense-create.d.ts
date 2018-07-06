import { Config, Nav, NavParams, ViewController } from 'ionic-angular';
import { ApiData } from '../../providers/api-data';
export declare class ExpenseCreatePage {
    private nav;
    private navParams;
    private apiData;
    private config;
    private view;
    expense: any;
    isbillable: boolean;
    he: any;
    selects: any;
    title: string;
    constructor(nav: Nav, navParams: NavParams, apiData: ApiData, config: Config, view: ViewController);
    ngOnInit(): void;
    saveSelect(event: any): void;
    onSubmit(form: any): void;
    setDate(date: any, showmonth?: any, istime?: any): any;
    getFixed(value: any): string;
    close(): void;
}
