import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {API_URL} from './config';
import 'rxjs/Rx'

let childURL = API_URL + 'r/gifs/new/.json?limit=1';

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

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
        this.http.get(childURL).subscribe(res => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.data = this.processData(res.json());
        resolve(this.data);
        }, error => { throw (error.json().error || 'Server error');/*console.log(error);*/}
       //console.log(JSON.stringify(error.json()));
  );
  });}

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
    return this.get().then(data => {
        return data.data.children;
    });
  }

}
