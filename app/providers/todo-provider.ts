import {Injectable} from '@angular/core';
import {Config, Events} from 'ionic-angular';
import {dontClearCache} from './config';
import {Headers, Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {ApiData} from './api-data';
import {addp} from '../directives/helpers';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import "rxjs/add/operator/publishLast";
import {MOCKS} from './mocks';

@Injectable()
export class TodoProvider {

    todos$: Object; //Array<Observable<Object[]>>;
    private _todosObserver: Object; //Array<Observer<Object[]>>;
    _dataStore: any;

    constructor(private apiData: ApiData, private config: Config, private events: Events) {
        this.todos$ = {}; //new Observable(observer => this._todosObserver = observer).share();
        this._todosObserver = {};
        this._dataStore = {};
     }

    getTodos(user_id, pager) {
        let url = addp("todos", "assigned_id", user_id);
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
        this.apiData.getPaged(url + "&all_item_types=true&is_completed=false&is_sub_view=true", pager).subscribe(data => {
            if (pager.page > 0  && cachelen > 0)
                this._dataStore[url].push(...data);
            else
                this._dataStore[url] = data;
            if (this._todosObserver[url])
                this._todosObserver[url].next(this._dataStore[url]);
        }, error => console.log('Could not load todologs.'));
        return cachelen;
    }

        addTodo(id, data) {
            let url = "todos/" + id;
            data = {
                task_id:null,
                title:"1",
                text:"2",
                assigned_id:1325,
                estimated_remain:null,
                due_date:null,
                notify:false,
                list_id:"d71f45cd260b4ae48761fa20e92af85d",
                ticket_key:null,
                project_id:0
            };
            return this.apiData.get(url, data, "POST");
        }

        setCompletedTodo(id, is_done) {
            let url = "todos/" + id;
            var stream = this.apiData.get(url, {is_completed : is_done}, "PUT").publishLast();
            stream.connect();
            return( stream );
        }
    }