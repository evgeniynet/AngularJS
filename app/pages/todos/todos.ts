import {Page, Config, Nav, NavParams, Modal} from 'ionic-angular';
import {TodoCreatePage} from '../todo-create/todo-create';
import {TodoListComponent} from '../../components/components';

@Page({
    templateUrl: 'build/pages/todos/todos.html',
    directives: [TodoListComponent],
})
export class TodosPage {

    is_empty: boolean = false;
    params: any;
    //undone: number = 0;
    
    constructor(private nav: Nav, private config: Config, private navParams: NavParams) {
    }

    onPageLoaded()
    {
        this.params = this.navParams.data || {};
        //this.pager = { page: 0 };
        this.params.user = { id: this.params.user_id || this.config.current.user.user_id, name: this.params.user_name || "" };
        /*let cachename = addp("todos", "assigned_id", this.params.user.id);
           this.todoProvider.todos$[cachename].subscribe(
                data => {
                    let count = 0;
                    for (let k in data) for (let l in data[k].sub) if (!data[k].sub[l].is_completed) count++;
                    this.undone = count;
                });
                */
        }

    AddTodo()
    {
        let myModal = Modal.create(TodoCreatePage, {"list_id": "" });
        this.nav.present(myModal);
    }
}