import { ApiData } from './api-data';
import 'rxjs';
export declare class DataProvider {
    private apiData;
    data$: Object;
    private _dataObserver;
    _dataStore: Object;
    constructor(apiData: ApiData);
    checkLogin(username: any, password: any): any;
    getOrganizations(token: any): any;
    registerOrganization(data: any): any;
    deleteFile(data: any): any;
    getConfig(): any;
    updateBadge(): void;
    getQueueList(limit?: any): any;
    getInvoices(account_id: any, status: any, pager: any): any;
    getInvoice(id: any, account_id: any, project_id: any): any;
    getExpenses(account_id: any, pager: any): any;
    getPriorities(): any;
    getLocationList(pager: any, is_open?: any): any;
    getAccountList(is_dashboard: any, pager: any, is_no_stat?: any, is_open?: any): any;
    getTechniciansList(pager: any, is_stat?: any, is_open?: any): any;
    getAccountDetails(id: any, is_no_stat?: any): any;
    getLocationDetails(id: any, is_no_stat?: any): any;
    addAccountNote(id: any, note: any): any;
    addUser(email: any, firstname: any, lastname: any, role: any): any;
    loginSkype(data: any): any;
}
