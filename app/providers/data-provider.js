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

getTicketsList() {
    let url = "tickets".addp("limit","3");
    return this.apiData.get(url);
}

getQueueList(limit) {
    let url = "queues".addp("sort_by","tickets_count");
    return this.apiData.get(url).map((arr: Array<any>) => {
        if (arr.length && limit)
            arr.length = limit; 
        return arr;
    });
}

}
