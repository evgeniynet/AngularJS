import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {getDateTime, getPickerDateTimeFormat, htmlEscape, linebreaks} from '../../directives/helpers';
import {TodoProvider} from '../../providers/todo-provider';

@Page({
    templateUrl: 'build/pages/todo-create/todo-create.html',
})
export class TodoCreatePage {

    todo: any;
    he: any;
    displayFormat: string;
    UserDateOffset: number = -5;

    constructor(private nav: Nav, private navParams: NavParams, private todoProvider: TodoProvider, private config: Config, private view: ViewController) {
    this.he = config.current.user;
    }
    
    ngOnInit()
    {
        this.todo = this.navParams.data || {};
        this.UserDateOffset = this.config.getCurrent("timezone_offset");
        this.displayFormat = getPickerDateTimeFormat(false, false);
        this.todo.due_date = this.todo.due_date ? this.AddHours(this.todo.due_date, this.UserDateOffset) : "";
    }

    AddHours(date, hours)
{
    if (date){
        if (date.length == 19)
            date = date.slice(0,-3);
        let temp = new Date(date);
        return new Date(temp.setTime(temp.getTime() + (hours*60*60*1000) + -1*temp.getTimezoneOffset()*60*1000)).toJSON();
    }
    return date;
}

    onSubmit(form) {
        let hours = this.todo.estimated_remain || "";
        if (form.valid) {
            if (hours) {
            if (~hours.indexOf('.')){
                let parts = hours.split('.');
                hours = Number(parts[0]) + Number(parts[1])/60;
            } else if (~hours.indexOf(':')){
                let parts = hours.split(':');
                hours = Number(parts[0]) + Number(parts[1])/60;
            } else if (Number(hours)){
                hours = Number(hours);
            }
        }
        else
            hours = 0;
            //proof double click
            if (this.todo.in_progress && Date.now() - this.todo.in_progress < 2500) {return;}
            this.todo.in_progress = Date.now();
            let data = {
                task_id:null,
                title: this.todo.title,
                text: this.todo.note,
                assigned_id: this.he.user_id,
                estimated_remain: hours,
                due_date: this.AddHours(this.todo.due_date, -1*this.UserDateOffset) || "",
                notify: false,
                list_id: this.todo.list_id,
                ticket_key: null,
                project_id:0
            };

            this.todoProvider.addTodo(data).subscribe(
                data => {
                    this.nav.alert('Todo was successfully added :)');
                    this.todoProvider.getTodos(this.he.user_id, "", { page: 0, limit: 5000 });
                    setTimeout(() => this.close(), 500);
                },
                error => {
                    console.log(error || 'Server error');
                }
                );
        }
    }

    setMinTime(date) {
        return (date || this.todo.due_date || this.AddHours(new Date(), this.UserDateOffset)).substring(0,4);
    }

    getStartDate(time) {
        return (time || this.todo.due_date || this.AddHours(new Date(), this.UserDateOffset)).substring(0,19);
    }

    setStartDate(time){
        if (time)
        {
            this.todo.due_date = time.substring(0,19);
        }
    }
    
    close() {
        this.view.dismiss();
    }
}

