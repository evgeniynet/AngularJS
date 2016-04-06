import {Injectable} from 'angular2/core';
import {Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {ApiData} from './api-data';
import * as helpers from '../directives/helpers';
import 'rxjs/add/operator/map';

@Injectable()
export class DataProvider {

    _data;

    get Cache() {
        return this._data;
    }

    set Cache(value) {
        this._data = value;
    }

    constructor(private apiData: ApiData) {

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
    return this.apiData.get(url);
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

getTimelogs(pager) {
    let url = "time";
    url = this.getPager(url, pager);
    return this.apiData.get(url);
}

getInvoices(account_id, pager) {
    let url = "invoices".addp("account_id",account_id);
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

closeOpenTicket(id, data) {
    let url = `tickets/${id}`;
    return this.apiData.get(url, data, "PUT");
}

addTime(id, data, method) {
    let url = "time" + (!id ? "" : ("/" + id));
    return this.apiData.get(url, data, method);
}

}
