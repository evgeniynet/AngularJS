import {Injectable} from 'angular2/core';
import {Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {ApiData} from './api-data';
import * as helpers from '../directives/helpers';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

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
    
    getConfig() {
        let url = "config";
        return this.apiData.get(url);
    }

    getTicketsList(tab, id, pager) {
    //"user","tech","alt","all"
    let url = "";
    switch (tab)
    {
        case "tech": 
        url = "tickets?status=open&role=tech";
        break;
        case "all": 
        url = "tickets?status=allopen&query=all";
        break;
        case "alt":
        url = "tickets?status=open&role=alt_tech";
        break;
        case "open":
        url = "tickets?status=open&account="+id;
        break;
        case "closed":
        url = "tickets?status=closed&account="+id;
        break;
        case 'queue':
        url = "queues/"+id;
        break;
        default:
        //case "user":
        url = "tickets?status=open,onhold&role=user";
        break;
    }
    url = this.getPager(url, pager);
    return this.apiData.get(url);
}

getTicketDetails(key) {
    let url = `tickets/${key}`;
    return this.apiData.get(url);
}

getTicketsCounts() {
    let url = "tickets/counts";
    if (!this._dataStore[url]) {
        this._dataStore[url] = [];
        this.data$[url] = new Observable(observer => { this._dataObserver[url] = observer; }).share();
    }
    else {
        if (this._dataStore[url].open_all >= 0) {
            setTimeout(() => {
                this._dataObserver[url].next(this._dataStore[url] || []);
            }, 0);
        }
    }
    this.apiData.get(url).subscribe(data => {
        this._dataStore[url] = data;
        this._dataObserver[url].next(this._dataStore[url]);
    }, error => console.log('Could not load tickets.'));
}

getQueueList(limit) {
    let url = "queues".addp("sort_by","tickets_count");
    return this.apiData.get(url).map((arr: Array<any>) => {
        if (arr && limit)
        {
            arr = arr.filter(function(val) {
                return val.tickets_count > 0}).slice(0, limit); 
        }
        return arr;
    });
}

    getTimelogs(account_id, pager) {
        let url = "time".addp("account", account_id);
    url = this.getPager(url, pager);
    return this.apiData.get(url);
}

getInvoices(account_id, status, pager) {
    let url = "invoices".addp("account",account_id);
    if (status === false)
        url = url.addp("status", "unbilled");
    url = this.getPager(url, pager);
    return this.apiData.get(url);
}

getInvoice(id, account_id, project_id) {
    let url = "invoices";
    let data = {};
    if (!id)
        url = url.addp("status", "unbilled").addp("account", account_id).addp("project", project_id);
    else 
    {
        url += "/" + id;
        url = url.addp("action", "sendEmail");
    }
    return this.apiData.get(url, data);
}

getExpenses(account_id, pager) {
    let url = "expenses".addp("account",account_id);
    url = this.getPager(url, pager);
    return this.apiData.get(url);
}

getPager(url, pager)
{
    if (pager) {
        if (pager.limit)
            url = url.addp("limit", pager.limit);
        if (pager.page)
            url = url.addp("page", pager.page);
    }
    return url;
}

getPaged(url, pager)
{
    url = this.getPager(url, pager);
    return this.apiData.get(url);
}

getAccountList(is_dashboard, pager, is_no_stat, is_open) {
    let url = "accounts";
    if (is_no_stat) 
        url = url.addp("is_with_statistics", "false");
    if (is_open) 
        url = url.addp("is_open_tickets", "true");
    url = this.getPager(url, pager);
    return this.apiData.get(url).map((arr: Array<any>) => {
        if (is_dashboard && arr) {
            arr = arr.filter(function(val) {
                return val.account_statistics.ticket_counts.open > 0});
        }
        return arr;
    });
}   

getAccountDetails(id,is_no_stat) {
    let url = `accounts/${id}`;
    if (is_no_stat) 
        url = url.addp("is_with_statistics", "false");
    return this.apiData.get(url);
}



addTicket(data) {
    let url = "tickets";
    data.status =  "open";
    return this.apiData.get(url, data, "POST");
}

addTicketPost(id, note) {
    let url = `tickets/${id}`;
    let data = { "action": "response", 
    "note_text": note,
};
return this.apiData.get(url, data, "POST");
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

closeOpenTicket(id, data) {
    let url = `tickets/${id}`;
    return this.apiData.get(url, data, "PUT");
}

addTime(id, data, method) {
    let url = "time" + (!id ? "" : ("/" + id));
    return this.apiData.get(url, data, method);
}

}
