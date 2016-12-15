import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {TodoProvider} from '../../providers/todo-provider';
import {addp} from '../../directives/helpers';
//import {TimelogPage} from '../timelog/timelog';
import {ActionButtonComponent} from '../../components/action-button/action-button';
import {getDateTime} from '../../directives/helpers';

@Page({
    templateUrl: 'build/pages/todos/todos.html',
    directives: [ActionButtonComponent],
    //directives: [TicketsListComponent, Focuser],
})
export class TodosPage {

	LIMIT: number = 5000;
    is_empty: boolean = false;
    params: any;
    pager: any;
    cachelen: number;
    undone: number = 0;
    cachename: string;
    todos: any;
    busy: boolean;
    hidden: boolean;
    initial_load: boolean = true;
    
    constructor(private nav: Nav, private todoProvider: TodoProvider, private config: Config, private navParams: NavParams, private view: ViewController) {
        this.pager = { page: 0, limit: this.LIMIT };
    }

onPageLoaded()
    {
        this.params = this.navParams.data || {};
        //this.pager = { page: 0 };
        this.params.user = { id: this.params.user_id || this.config.current.user.user_id, name: this.params.user_name || "" };

        this.cachename = addp("todos", "assigned_id", this.params.user.id);
        this.cachelen = (this.todoProvider._dataStore[this.cachename] || {}).length;

        if (this.params.is_empty)
            this.params.count = 0;

        //if (this.params.count !== 0) {
            this.getTodos();
        //}
        //else
        //    this.is_empty = true;
    }

    getTodos()
    {
        this.todoProvider.getTodos(this.params.user.id, this.pager);
        this.todos = this.todoProvider.todos$[this.cachename];
        //if (!this.cachelen)
        {
            var timer = setTimeout(() => {
                this.busy = true;
            }, 500);
            setTimeout(() => {
                this.busy = false;
            }, 3000);
            this.todos.subscribe(
                data => {
                    clearTimeout(timer);
                    this.busy = false;
                    this.is_empty = !data.length;
                    let count = 0;
                    for (let k in data) for (let l in data[k].sub) if (!data[k].sub[l].is_completed) count++;
                    this.undone = count;
                });
        }
    }

    setDone(todo){
    	this.undone = Math.max(todo.is_completed ? --this.undone : ++this.undone, 0);
    	this.todoProvider.setCompletedTodo(todo.id, todo.is_completed);
    }

    setDate(date, showmonth?, istime?) {
        return date ? getDateTime(date, showmonth, istime) : null;
    }

    getFixed(value){
    	value = (value || "0").toString()
        if (~value.indexOf("."))
        	return Number(value).toFixed(2).toString();
        return value;
    }


}