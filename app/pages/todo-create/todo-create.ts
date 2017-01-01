import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {getDateTime, htmlEscape, linebreaks} from '../../directives/helpers';
import {TodoProvider} from '../../providers/todo-provider';

@Page({
    templateUrl: 'build/pages/todo-create/todo-create.html',
})
export class TodoCreatePage {

    todo: any;
    he: any;
    
    constructor(private nav: Nav, private navParams: NavParams, private todoProvider: TodoProvider, private config: Config, private view: ViewController) {
    this.he = config.current.user;
    }
    
    ngOnInit()
    {
        this.todo = this.navParams.data || {};
    }

    onSubmit(form) {
        if (form.valid) {
            //proof double click
            if (this.todo.in_progress && Date.now() - this.todo.in_progress < 1500) {return;}
            this.todo.in_progress = Date.now();
            let data = {
                task_id:null,
                title:"1",
                text:"2",
                assigned_id:this.he.user_id,
                estimated_remain:2,
                due_date:null,
                notify:false,
                list_id: this.todo.list_id,
                ticket_key:null,
                project_id:0
            };

            this.todoProvider.addTodo(data).subscribe(
                data => {
                    this.nav.alert('Todo was successfully added :)');
                    setTimeout(() => this.close(), 500);
                },
                error => {
                    console.log(error || 'Server error');
                }
                );
        }
    }

    setDate(date, showmonth?, istime?) {
        return date ? getDateTime(date, showmonth, istime) : null;
    }

    
    getFixed(value){
        return Number(value || "0").toFixed(2).toString();
    }
    
    close() {
        this.view.dismiss();
    }
}

