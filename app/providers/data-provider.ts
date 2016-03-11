import {Injectable} from 'angular2/core';
import {Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {ApiData} from './api-data';
import 'rxjs/add/operator/map';

String.prototype.addp = function(param, value) {
    if (!value || !param)
        return this;
    var pos = this.indexOf(param + '=');
    //if parameter exists
    if (pos != -1)
        return this.slice(0, pos + param.length) + '=' + value;
    var ch = this.indexOf('?') > 0 ? '&' : '?';
    return this + ch + param + '=' + value;
};

@Injectable()
export class DataProvider {

constructor(apiData: ApiData) {
    // inject the Http provider and set to this instance
    this.apiData = apiData;
}
    
checkLogin(username, password) {
        if(!username || !password) {
            return this.apiData.handleError("Please enter login and password!");
        }
    
        let url = "login";
        var headers = new Headers({
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
    return this.apiData.request(url, "", "", headers);
}
    
getConfig() {
        let url = "config";
        return this.apiData.get(url);
    }

getTicketsList(tab, id) {
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
            arr.length = limit; 
        return arr;
    });
}
    
getAccountList(is_dashboard, pager, is_no_stat, is_open) {
    let url = "accounts";
    if (is_no_stat) 
        url = url.addp("is_with_statistics", "false");
    if (is_open) 
        url = url.addp("is_open_tickets", "true");
    if (pager) {
        if (pager.limit)
        url = url.addp("limit", pager.limit);
        if (pager.page)
        url = url.addp("page", pager.page);
    }
    return this.apiData.get(url).map((arr: Array<any>) => {
        let result = [];
        if (is_dashboard && arr) {
            arr.forEach((account) => {
                if (account.account_statistics.ticket_counts.open > 0)
                result.push(account);
            });
        }
        else
            return arr;
        return result;
    });
}   
    
getAccountDetails(id,is_no_stat) {
    let url = `accounts/${id}`;
    if (is_no_stat) 
        url = url.addp("is_with_statistics", "false");
    return this.apiData.get(url);
}

}
