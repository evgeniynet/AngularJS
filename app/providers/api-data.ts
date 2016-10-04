import {Injectable} from '@angular/core';
import {Config, Events} from 'ionic-angular';
import {Http, Headers, RequestOptions, Request} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {ApiSite, dontClearCache} from './config';
import {addp} from '../directives/helpers';
import {MOCKS} from './mocks';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class ApiData {
    
//userKey, userOrgKey, userInstanceKey: string; 
//mock: boolean = dontClearCache;

    constructor(private http: Http, private config: Config, private events: Events) {
}

request(method, data?, type?, headers?) {
    if (dontClearCache)
    {
        return this.mock_get(method);
    }
    //if (!this.config.getCurrent("is_online"))
    //    return;
    let req = new Request({
        method: type || 'GET',
        url: ApiSite + method,
        headers: headers,
        body: JSON.stringify(data)
    });

    return this.http.request(req)
        .map(res => res.json())
        .catch(error => {
            return this.handleError(error);
                        });
}

mock_get(method) {
    var arr = null;
    var pos = method.indexOf('?');
    if (pos != -1)
        method = method.substring(0, pos);
    arr = MOCKS[method];
    return Observable.create(observer => {
        observer.next(arr);
        observer.complete();
    });
}

    get(method, data?, type?) {
    let key = this.config.getCurrent("key"),
        //localStorage.getItem("userKey"),
        org = this.config.getCurrent("org"), // localStorage.getItem('userOrgKey'),
        inst = this.config.getCurrent("instance");// localStorage.getItem('userInstanceKey');
    
    if (!key || !org || !inst || key.length != 32) {
        return this.handleError("403: Invalid organization!");
    }

    var headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${org}-${inst}:${key}`)
    });
    return this.request(method, data, type, headers);

}

processData(data) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    //console.log(JSON.stringify(data));
    return data;
}

getPager(url, pager) {
    if (pager) {
        if (pager.limit)
            url = addp(url, "limit", pager.limit);
        if (pager.page)
            url = addp(url, "page", pager.page);
    }
    return url;
}

getPaged(url, pager) {
    url = this.getPager(url, pager);
    return this.get(url);
}

handleError(error) : any {
    /*if ((request.status == 403 && settings.url !== ApiSite + "organizations") || (request.status == 404 && settings.url === ApiSite + "config"))
    {
        logout(settings.url !== ApiSite + "login", request.statusText);
    }*/
//console.log(error);
    let message: string = "";
    try {
        var e = JSON.parse(error._body);
        if (typeof e === 'string')
            message = e;
        else
            message = ((e || {}).ResponseStatus || {}).Message;
    } catch (e) {
        message = error._body; 
        if (message == "[object ProgressEvent]")
            message = "Cannot connect to API server";
    }
    message = message || "Error. Please contact Administrator";
    let url = error.url || "";
    let status = (error.status || {}).toString();
    message += " (" + status + ") ";
    if (
        (status == "403" && !~url.indexOf("organizations"))  || ~url.indexOf("config") || ~message.indexOf("User with token"))
        {
            this.events.publish("login:failed");
        }

    this.events.publish("connection:error", (message || "Error occured") + " Please contact Administator!");

    return Observable.throw(new Error(message));
}
}
