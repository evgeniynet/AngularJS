import {Injectable} from 'angular2/core';
import {Config, Events} from 'ionic-angular';
import {dontClearCache} from './config';
import {Headers, Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {ApiData} from './api-data';
import {addp} from '../directives/helpers';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import {MOCKS} from './mocks';

@Injectable()
export class TicketProvider {

    tickets$: Object; //Array<Observable<Object[]>>;
    private _ticketsObserver: Object; //Array<Observer<Object[]>>;
    _dataStore: any;

    constructor(private apiData: ApiData, private config: Config, private events: Events) {
        this.tickets$ = {}; //new Observable(observer => this._ticketsObserver = observer).share();
        this._ticketsObserver = {};
        this._dataStore = {
            all: [],
            alt: [],
            tech: [],
            user: []
        };
     }

    getTicketsList(tab, id, pager) {
        //"user","tech","alt","all"
        let url = "";
        switch (tab.toString()) {
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
            url = "tickets?status=open&account=" + id;
            break;
            case "closed":
            url = "tickets?status=closed&account=" + id;
            break;
            case 'queue':
            url = "queues/" + id;
            break;
            default:
                //case "user":
                url = "tickets?status=open,onhold&role=user";
                break;
            }
            pager.limit = pager.limit || 25;
            pager.page = pager.page || 0;
            tab += id || "";
            this._dataStore[tab] = this._dataStore[tab] || [];
            if (dontClearCache){
                this.tickets$[tab] = new Observable(observer => this._ticketsObserver[tab] = observer).share();
                this._dataStore[tab] = MOCKS["tickets"];
            }
            let cachelen = this._dataStore[tab].length;
            if (pager.page == 0){
                pager.limit = cachelen || pager.limit;
                    if (cachelen){
                        setTimeout(() => {
                            if (this._ticketsObserver[tab])
                        this._ticketsObserver[tab].next(this._dataStore[tab] || []);
                        }, 0);
                    }
                    else
                    {
                        this.tickets$[tab] = new Observable(observer => this._ticketsObserver[tab] = observer).share();
                    }
                
            }
            this.apiData.getPaged(url, pager).subscribe(data => {
                if (pager.page > 0)
                    this._dataStore[tab].push(...data);
                else
                    this._dataStore[tab] = data;
                if (this._ticketsObserver[tab])
                this._ticketsObserver[tab].next(this._dataStore[tab]);
                //if (data.length < pager.limit)
                // add flag that data completed
            }, error => console.log('Could not load tickets.'));
            return cachelen;
        }


        getTicketDetails(key) {
            let url = `tickets/${key}`;
            return this.apiData.get(url);
        }

        getTicketsCounts() {
            let url = "tickets/counts";
            if (!this._dataStore[url]) {
                this._dataStore[url] = [];
                this.tickets$[url] = new Observable(observer => { this._ticketsObserver[url] = observer; }).share();
            }
            else {
                if (this._dataStore[url].open_all >= 0) {
                    setTimeout(() => {
                        this._ticketsObserver[url].next(this._dataStore[url] || []);
                    }, 0);
                }
            }
            this.apiData.get(url).subscribe(data => {
                this._dataStore[url] = data;
                this._ticketsObserver[url].next(this._dataStore[url]);
            }, error => console.log('Could not load tickets.'));
        }

        addTicket(data) {
            let url = "tickets";
            data.status =  "open";
            return this.apiData.get(url, data, "POST");
        }

        closeOpenTicket(id, data) {
            let url = `tickets/${id}`;
            return this.apiData.get(url, data, "PUT");
        }

        addTicketPost(id, note) {
            let url = `tickets/${id}`;
            let data = {
                "action": "response",
                "note_text": note,
            };
            return this.apiData.get(url, data, "POST");
        }
  }

/*
export interface Todo {
    id: number;
    createdAt: number;
    value: string;
}

@Injectable()
export class TodoService {
    todos$: Observable<Todo[]>;
    private _baseUrl: string;
    private _todosObserver: Observer<Todo[]>;
    private _dataStore: {
        todos: Todo[]
    };

    constructor(private _http: Http) {
        this._baseUrl = 'http://56e05c3213da80110013eba3.mockapi.io/api';
        this.todos$ = new Observable(observer => this._todosObserver = observer).share();
        this._dataStore = { todos: [] };
    }

    loadTodos() {
        this._http.get(`${this._baseUrl}/todos`).map(response => response.json()).subscribe(data => {
            this._dataStore.todos = data;
            this._todosObserver.next(this._dataStore.todos);
        }, error => console.log('Could not load todos.'));
    }

    createTodo(todo: Todo) {
        this._http.post(`${this._baseUrl}/todos`, todo)
            .map(response => response.json()).subscribe(data => {
                this._dataStore.todos.push(data);
                this._todosObserver.next(this._dataStore.todos);
            }, error => console.log('Could not create todo.'));
    }

    updateTodo(todo: Todo) {
        this._http.put(`${this._baseUrl}/todos/${todo.id}`, todo)
            .map(response => response.json()).subscribe(data => {
                this._dataStore.todos.forEach((todo, i) => {
                    if (todo.id === data.id) { this._dataStore.todos[i] = data; }
                });

                this._todosObserver.next(this._dataStore.todos);
            }, error => console.log('Could not update todo.'));
    }

    deleteTodo(todoId: number) {
        this._http.delete(`${this._baseUrl}/todos/${todoId}`).subscribe(response => {
            this._dataStore.todos.forEach((t, i) => {
                if (t.id === todoId) { this._dataStore.todos.splice(i, 1); }
            });

            this._todosObserver.next(this._dataStore.todos);
        }, error => console.log('Could not delete todo.'));
    }
}
*/