import {Injectable} from '@angular/core';
import {Config, Events} from 'ionic-angular';
import {dontClearCache} from './config';
import {Headers, Http} from '@angular/http';
import {Observable, Observer} from 'rxjs';
import {ApiData} from './api-data';
import {addp} from '../directives/helpers';
import "rxjs";
import {MOCKS} from './mocks';

@Injectable()
export class TodoProvider {

    URL: string = "todos";
    todos$: Object; //Array<Observable<Object[]>>;
    private _todosObserver: Object; //Array<Observer<Object[]>>;
    _dataStore: any;

    constructor(private apiData: ApiData, private config: Config, private events: Events) {
        this.todos$ = {}; //new Observable(observer => this._todosObserver = observer).share();
        this._todosObserver = {};
        this._dataStore = {};
     }

    getTodos(user_id, ticket, completed, pager, no_cache) {
        let url = this.URL;
        if (user_id)
            url = addp(this.URL, "assigned_id", user_id);
        if (ticket) 
            url = addp(url, "ticket", ticket || "");
        url = addp(url, "is_completed", completed || " ");

        pager.limit = pager.limit || 25;
        pager.page = pager.page || 0;
        this._dataStore[url] = this._dataStore[url] || [];
        if (dontClearCache) {
            this.todos$[url] = new Observable(observer => this._todosObserver[url] = observer).share();
            this._dataStore[url] = MOCKS["todo"];
        }
        let cachelen = this._dataStore[url].length;
        if (pager.page == 0) {
            //pager.limit = cachelen || pager.limit;
            if (cachelen) {
                setTimeout(() => {
                    if (this._todosObserver[url])
                        this._todosObserver[url].next(this._dataStore[url] || []);
                }, 0);
            }
            else {
                this.todos$[url] = new Observable(observer => this._todosObserver[url] = observer).share();
            }

        }
        var gotourl = url;
        this.apiData.getPaged(gotourl.replace("is_completed= ", "is_completed=") + "&all_item_types=true&is_sub_view=true" + (no_cache ? "&c=1" : ""), pager).subscribe(data => {
            if (pager.page > 0  && cachelen > 0)
                this._dataStore[url].push(...data);
            else
                this._dataStore[url] = data;
            if (this._todosObserver[url])
                this._todosObserver[url].next(this._dataStore[url]);
        }, error => console.log('Could not load todologs.'));
        return cachelen;
    }
 
        addTodo(data) {
            return this.apiData.get(this.URL, data, "POST");
        }

        deleteTodo(id) {
            let url = `${this.URL}/${id}`;
            return this.apiData.get(url, {}, "DELETE");
        }

        setCompletedTodo(id, is_done) {
            let url = `${this.URL}/${id}`;
            var stream = this.apiData.get(url, {is_completed : is_done}, "PUT").publishLast();
            stream.connect();
            return( stream );
        }
    }