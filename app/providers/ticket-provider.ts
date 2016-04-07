import {Injectable} from 'angular2/core';
import {Headers, Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {ApiData} from './api-data';
import * as helpers from '../directives/helpers';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

@Injectable()
export class TicketProvider {

    tickets$: Observable<Object[]>;
    private _ticketsObserver: Observer<Object[]>;
    _dataStore: {
        all: Object[],
        alt: Object[],
        tech: Object[],
        user: Object[]
    };
    constructor(private apiData: ApiData) {
        //this.tickets$ = new Observable(observer => this._ticketsObserver = observer).share();
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
        url = this.getPager(url, pager);
        return this.apiData.get(url);
        /*.subscribe(data => {
            this._dataStore[tab] = data;
            //this._ticketsObserver.next(this._dataStore[tab]);
        }, error => console.log('Could not load tickets.'));
        */
    }
    
    
getTicketDetails(key) {
    let url = `tickets/${key}`;
    return this.apiData.get(url);
}

getTicketsCounts() {
    let url = "tickets/counts";
    return this.apiData.get(url);
}

getPager(url, pager)
{
    if (pager) {
        if (pager.limit)
            url = url.addp("limit", pager.limit);
        if (pager.page)
            url = url.addp("page", pager.page);
    }
    return url;
}

getPaged(url, pager)
{
    url = this.getPager(url, pager);
    return this.apiData.get(url);
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