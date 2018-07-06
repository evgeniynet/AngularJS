import { Config, Events } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs';
export declare class ApiData {
    private http;
    private config;
    private events;
    constructor(http: Http, config: Config, events: Events);
    request(method: any, data?: any, type?: any, headers?: any): any;
    mock_get(method: any): any;
    get(method: any, data?: any, type?: any): any;
    processData(data: any): any;
    getPager(url: any, pager: any): any;
    getPaged(url: any, pager: any): any;
    handleError(error: any): any;
}
