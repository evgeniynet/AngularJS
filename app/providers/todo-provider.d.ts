import { Config, Events } from 'ionic-angular';
import { ApiData } from './api-data';
import "rxjs";
export declare class TodoProvider {
    private apiData;
    private config;
    private events;
    URL: string;
    todos$: Object;
    private _todosObserver;
    _dataStore: any;
    constructor(apiData: ApiData, config: Config, events: Events);
    getTodos(user_id: any, ticket: any, pager: any): any;
    addTodo(data: any): any;
    setCompletedTodo(id: any, is_done: any): any;
}
