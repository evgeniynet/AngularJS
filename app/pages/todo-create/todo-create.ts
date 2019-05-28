import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {getDateTime, getPickerDateTimeFormat, htmlEscape, linebreaks} from '../../directives/helpers';
import {SelectListComponent} from '../../components/select-list/select-list';
import {TodoProvider} from '../../providers/todo-provider';

@Page({
    templateUrl: 'build/pages/todo-create/todo-create.html',
        directives: [forwardRef(() => SelectListComponent)],

})
export class TodoCreatePage {

    todo: any;
    he: any;
    displayFormat: string;
    UserDateOffset: number = -5;
    account_id: number;
    selects: any = {};

    constructor(private nav: Nav, private navParams: NavParams, private todoProvider: TodoProvider, private config: Config, private view: ViewController) {
    this.he = config.current.user;
    }
    
    ngOnInit()
    {
        this.todo = this.navParams.data || {};
        this.UserDateOffset = this.config.getCurrent("timezone_offset");
        this.displayFormat = getPickerDateTimeFormat(false, false);
        this.todo.due_date = this.todo.due_date ? this.AddHours(this.todo.due_date, this.UserDateOffset) : "";

        let recent : any = {};
        if (!this.todo.account)
        {
                recent = this.config.current.recent || {};
        }

        this.account_id = (this.todo.account || {}).id || (recent.account || {}).selected || this.he.account_id || -1;
        let project_id = (this.todo.project || {}).id || this.todo.project_id || (recent.project || {}).selected || 0;
       this.selects.tech = {
            name: "Tech", 
            value: (this.todo.tech || {}).name || "Choose",
            selected: (this.todo.tech || {}).id || 0,
            url: this.config.current.is_allow_user_choose_tech && this.config.current.is_allow_user_choose_queue_only ? "users?role=queue" : "technicians",
            hidden: false
        };
 
        this.selects.account = {
            name: "Account", 
            value: (this.todo.account || {}).name || (recent.account || {}).value || this.he.account_name,
            selected: this.account_id,
            url: "accounts?is_with_statistics=false&limit=500",
            hidden: false
        };
        this.selects.project =  {
                name: "Project", 
                value: (recent.project || {}).value || "Default",
                selected: project_id,
                url: `projects?account=${this.account_id}&is_with_statistics=false`,
                hidden: false
            };
        this.selects.ticket =  {
                    name: "Ticket", 
                    value: this.todo.ticket_number ? `#${this.todo.ticket_number}: ${this.todo.ticket_subject}` : "Choose (optional)",
                    selected: this.todo.ticket_number || 0,
                    url: `tickets?status=open&account=${this.account_id}&project=${project_id}`,
                    hidden: this.todo.is_project_log || false,
                    is_disabled: this.todo.task_type_id
                };     
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

    saveSelect(event){
        let name = event.type;
        this.account_id = this.selects.account.selected;
        let project_id = this.selects.project.selected;
        switch (name) {
            case "account" :
                this.selects.project.url = `projects?account=${event.id}&is_with_statistics=false`;
                this.selects.project.value = "Default";
                this.selects.project.selected = 0;
                project_id = 0;
                this.selects.account.value = event.name;
                this.selects.account.selected = event.id;
                this.account_id = event.id;

                if (!this.todo.task_type_id){
                this.selects.ticket.url = `tickets?status=open&account=${this.account_id}&project=${project_id}`,
                this.selects.ticket.value = "Choose (optional)";
                this.selects.ticket.selected = 0;
            }
                break;
            case "project" :
            if (this.selects.project.selected === event.id)
            {
                break;
            }
            this.selects.project.value = event.name;
            this.selects.project.selected = event.id;
            if (!this.todo.task_type_id){
                this.selects.ticket.hidden = this.todo.is_project_log || this.todo.task_type_id || false;
                this.selects.ticket.url = `tickets?status=open&account=${this.account_id}&project=${event.id}`,
                this.selects.ticket.value = "Choose (optional)";
                this.selects.ticket.selected = 0;
            }
            project_id = event.id;
            break;    
            default:
                    this.selects[name].selected = event.id;
                    this.selects[name].value = event.name || "Default";
            break;
        }
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
                account_id: this.account_id,
                project_id: this.selects.project.selected,
                text: this.todo.note,
                assigned_id: this.selects.tech.selected,
                estimated_remain: hours,
                due_date: this.AddHours(this.todo.due_date, -1*this.UserDateOffset) || "",
                notify: false,
                list_id: this.todo.list_id,
                ticket_key: this.selects.ticket.selected,
            };

            this.todoProvider.addTodo(data).subscribe(
                data => {
                    this.nav.alert('Todo was successfully added :)');
                    this.todoProvider.getTodos(this.he.user_id, "", "false", { page: 0, limit: 5000 });
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

