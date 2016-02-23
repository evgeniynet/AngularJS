import {Injectable} from 'angular2/core';
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
    
getAccountList(is_dashboard) {
    let url = "accounts";
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

}
