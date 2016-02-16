import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions, Request} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {ApiSite} from './config';
//import 'rxjs/Rx'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiData {

userKey, userOrgKey, userInstanceKey: string; 

constructor(http: Http) {
    // inject the Http provider and set to this instance
    this.http = http;
    this.userKey = "re36rym3mjqxm8ej2cscfajmxpsew33m", //localStorage.getItem("userKey"),
        this.userOrgKey = "zwoja4", // localStorage.getItem('userOrgKey'),
        this.userInstanceKey = "ms2asm";// localStorage.getItem('userInstanceKey');
}

request(method, data, type, headers) {
    let req = new Request({
        method: type || 'GET',
        url: ApiSite + method,
        headers: headers,
        body: JSON.stringify(data)
    });

    return this.http.request(req)
        .map(res => res.json())
        .catch(this.handleError);
}

get(method, data, type) {
    if (!this.userKey || !this.userOrgKey || !this.userInstanceKey || this.userKey.length != 32) {
        console.log("Invalid organization!");
        return;
    }
    var headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(this.userOrgKey + '-' + this.userInstanceKey +':'+this.userKey)
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
    //console.error(error);
    return Observable.throw(error.json().error || 'Server error');
}
}
