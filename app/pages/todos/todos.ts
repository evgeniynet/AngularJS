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
    account: any;
    is_empty: boolean = false;
    params: any;
    pager: any;
    cachelen: number;
    cachename: string;
    todos: any;
    busy: boolean;
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

        if (this.params.count !== 0) {
            this.getTodos();
        }
        else
            this.is_empty = true;
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
            this.todos.subscribe(
                data => {
                    clearTimeout(timer);
                    this.busy = false;
                    this.is_empty = !data.length;
                });
        }
    }


}