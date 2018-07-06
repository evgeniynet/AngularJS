import { Config, Events } from 'ionic-angular';
import { ApiData } from './api-data';
import 'rxjs';
export declare class TicketProvider {
    private apiData;
    private config;
    private events;
    URL: string;
    tickets$: Object;
    private _ticketsObserver;
    _dataStore: any;
    constructor(apiData: ApiData, config: Config, events: Events);
    getTicketsList(tab: any, id: any, location: any, pager: any): any;
    getTicketDetails(key: any): any;
    getUserProfile(user_id: any): any;
    getTicketsCounts(): void;
    addTicket(data: any): any;
    closeOpenTicket(id: any, data: any): any;
    escalateTicket(id: any, is_esc: any): any;
    addTicketPost(id: any, note: any, files?: any, waiting_response?: any): any;
    addTicketWorkpad(id: any, workpad: any): any;
    addTicketNote(id: any, note: any): any;
}
