import {Injectable} from '@angular/core';
import {Headers} from '@angular/http';
import {Observable, Observer} from 'rxjs';
import {ApiData} from './api-data';
import {addp} from '../directives/helpers';
import 'rxjs';

@Injectable()
export class DataProvider {

    data$: Object; 
    private _dataObserver: Object; 
    _dataStore: Object;

    constructor(private apiData: ApiData) {
        this.data$ = {}; 
        this._dataObserver = {};
        this._dataStore = {};
    }
    
    checkLogin(username, password) {
        if(!username || !password) {
            return this.apiData.handleError("Please enter login and password!");
        }

        let url = "login";
        var headers = new Headers({
            'Content-Type': 'text/plain;charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*',
            'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        });
        return this.apiData.request(url, 
            "",
            "POST", headers);
    }
    
    getOrganizations(token) {
        if(!token || token.length != 32) {
            return this.apiData.handleError("Invalid token!");
        }
        let url = "organizations";
        var headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`x:${token}`)
        });
        return this.apiData.request(url, " ", "", headers);
    }

    registerOrganization(data) {
        let url = "organizations";
        var headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        });
        return this.apiData.request(url, data, "POST", headers);
    }

    deleteFile(data) {
        let url = "files/" + data.file_id;
        return this.apiData.get(url, data, "DELETE");
    }
    
    getConfig() {
        let url = "config";
        return this.apiData.get(url);
    }

 updateBadge() {
    if (window.cordova && ((cordova.plugins || {}).notification || {}).badge){
        if (localStorage.badge > 0){
            cordova.plugins.notification.badge.set(localStorage.badge);
        }
        else
            cordova.plugins.notification.badge.clear();
    }
}

//update badge every 1 min 
getQueueList(limit?) {
    let url = addp("queues","sort_by", "tickets_count");
    return this.apiData.get(url).map((arr: Array<any>) => {

        let nt = arr.filter((val) => val.fullname.toLowerCase().indexOf("new ticket") == 0); 
        let badge = 0;
        if (nt && nt.length > 0) badge = nt[0].tickets_count;
        localStorage.badge = badge;

        this.updateBadge();

        if (arr && limit)
        {
            arr = arr.filter((val) => val.tickets_count > 0).slice(0, limit); 
        }
        return arr;
    });
}

getInvoices(account_id, status, pager) {
    let url = addp("invoices","account", account_id);
    if (status === false)
        url = addp(url, "status", "unbilled");
    return this.apiData.getPaged(url, pager);
}

getInvoice(id, account_id, contract_id) {
    let url = "invoices";
    let data = {};
    if (!id){
        url = addp(url, "status", "unbilled");
        url = addp(url, "account", account_id);
        url = addp(url, "contract_id", contract_id);
    }
    else 
    {
        url += "/" + id;
        url = addp(url, "action", "sendEmail");
    }
    return this.apiData.get(url, data);
}

getExpenses(account_id, pager) {
    let url = addp("expenses", "account", account_id);
    return this.apiData.getPaged(url, pager);
}

getPriorities() {
    return this.apiData.get("priorities");
}

getLocationList(pager, is_open?) {
    let url = "locations";
    if (is_open) 
        url = addp(url, "is_open_tickets", "true");
    return this.apiData.getPaged(url, pager);
} 

getAccountList(is_dashboard, pager, is_no_stat?, is_open?) {
    let url = "accounts";
    if (is_no_stat) 
        url = addp(url, "is_with_statistics", "false");
    if (is_open) 
        url = addp(url, "is_open_tickets", "true");
    return this.apiData.getPaged(url, pager).map((arr: Array<any>) => {
        if (is_dashboard && arr) {
            arr = arr.filter(val => val.account_statistics.ticket_counts.open > 0);
        }
        return arr;
    });
}   

getTechniciansList(pager, is_stat?, is_open?) {
    let url = "technicians";
    if (is_stat) 
        url = addp(url, "is_with_statistics", "true");
    if (is_open) 
        url = addp(url, "is_open_tickets", "true");
    return this.apiData.getPaged(url, pager);    
}   

getAccountDetails(id,is_no_stat?) {
    let url = `accounts/${id}`;
    if (is_no_stat) 
        url = addp(url, "is_with_statistics", "false");
    return this.apiData.get(url);
}
getLocationDetails(id,is_no_stat?) {
    let url = `locations/${id}`;
    if (is_no_stat) 
        url = addp(url, "is_with_statistics", "false");
    return this.apiData.get(url);
}

    addAccountNote(id, note) {
        let url = `accounts/${id}`;
        let data = {
            "note": note,
        };
        return this.apiData.get(url, data, "PUT");
    }


addUser(email, firstname, lastname, role) {
    let url = "users";
    let data = {
        "Lastname": lastname,
        "Firstname": firstname,
        "email": email,
        "role": role
};
return this.apiData.get(url, data, "POST");
}

loginSkype(data) {
    let url = "skype/login";
return this.apiData.get(url, data, "POST");
}

}
