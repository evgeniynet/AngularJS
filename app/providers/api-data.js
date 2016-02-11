import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions, RequestMethod} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {ApiSite} from './config';
import 'rxjs/Rx'

@Injectable()
export class ApiData {
  constructor(http: Http) {
    // inject the Http provider and set to this instance
    this.http = http;
  }

    get(method, data, type) {
    let userKey = localStorage.getItem("userKey"),
        userOrgKey = localStorage.getItem('userOrgKey'),
        userInstanceKey = localStorage.getItem('userInstanceKey');
        userKey = "re36rym3mjqxm8ej2cscfajmxpsew33m";
        userOrgKey = "zwoja4";
        userInstanceKey = "ms2asm";
        method = "tickets?limit=2"
        data = {};
        if (!userKey || !userOrgKey || !userInstanceKey || userKey.length != 32) {
            console.log("Invalid organization!");
            return;
        }
        if( !type ) type = 'GET';
    if (this.data) {
      // already loaded data
      //return Promise.resolve(this.data);
    }

        let url = ApiSite + method;
        let base64 = btoa(userOrgKey + '-' + userInstanceKey +':'+userKey);
        var options = new RequestOptions({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64
            }
            method: RequestMethod.Get,
            
        });
      return this.http.request(url, options)
          .map(res => this.processData(res.json()))
          .catch(this.handleError);
      
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

  getChildren() {
      
  }

}
