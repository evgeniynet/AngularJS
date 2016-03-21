import {Injectable} from 'angular2/core';
import {Config, Events} from 'ionic-framework/ionic';
import {Http, Headers, RequestOptions, Request} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {ApiSite, dontClearCache} from './config';
import {MOCKS} from './mocks';
//import 'rxjs/Rx'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class ApiData {

    _data;

    get Cache() {
        return this._data;
    }

    set Cache(value) {
        this._data = value;
    }
    
//userKey, userOrgKey, userInstanceKey: string; 
//mock: boolean = dontClearCache;

    constructor(http: Http, config: Config, events: Events) {
    // inject the Http provider and set to this instance
    this.http = http;
    this.config = config;
    this.events = events;
}

request(method, data, type, headers) {
    if (dontClearCache)
    {
        return this.mock_get(method);
    }
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

get(method, data, type) {
    let key = this.config.current.key,
        //localStorage.getItem("userKey"),
        org = this.config.current.org, // localStorage.getItem('userOrgKey'),
        inst = this.config.current.instance;// localStorage.getItem('userInstanceKey');
    
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

handleError(error) {
    console.error(error);
    /*if ((request.status == 403 && settings.url !== ApiSite + "organizations") || (request.status == 404 && settings.url === ApiSite + "config"))
    {
        logout(settings.url !== ApiSite + "login", request.statusText);
    }*/
    if (~(error.status || error).toString().indexOf("403"))
        {
            this.events.publish("login:failed", null);
        }
    if (error.constructor !== String)
        error = (error || {}).json().error;
    return Observable.throw(new Error(error));
}
}