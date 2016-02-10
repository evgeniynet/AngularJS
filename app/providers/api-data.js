import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {API_URL} from './config';
import 'rxjs/Rx'

let childURL = API_URL + 'r/gifs/new/.json?limit=3';

@Injectable()
export class ApiData {
  constructor(http: Http) {
    // inject the Http provider and set to this instance
    this.http = http;
  }

  get() {
    if (this.data) {
      // already loaded data
      //return Promise.resolve(this.data);
    }

      return this.http.get(childURL)
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
