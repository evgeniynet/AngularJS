import {IONIC_DIRECTIVES, Nav, NavParams, Config, Modal} from 'ionic-angular';
import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {TodoProvider} from '../../providers/todo-provider';
import {TodoCreatePage} from '../../pages/todo-create/todo-create';
import {addp, getDateTime} from '../../directives/helpers';
import {TicketDetailsPage} from '../../pages/ticket-details/ticket-details';
import {Subject} from 'rxjs';

@Component({
    selector: 'todo-list',
    templateUrl: 'build/components/todo-list/todo-list.html',
    directives: [IONIC_DIRECTIVES],
})

export class TodoListComponent {
    @Input() simple: boolean;
    @Input() ticket: string = "";
    @Input() user: string = "";
    @Input() assigned: string = "";
    @Input() completed: string = "false";
    LIMIT: number = 250;
    is_empty: boolean = false;
    is_empty_list: boolean = true;
    params: any;
    pager: any;
    cachelen: number;
    undone: number = 0;
    cachename: string;
    todoLists: any;
    busy: boolean;
    hidden: boolean;
    initial_load: boolean = true;
    private unsubscribe$:Subject<void> = new Subject();

     constructor(private nav: Nav, private todoProvider: TodoProvider, private config: Config, private navParams: NavParams) {
         this.is_empty = false;
}

    
    ngOnChanges(event) {
        if ("completed" in event) {
            if (event.completed.isFirstChange())
                 return;
             this.completed = event.completed.currentValue;
             this.cachename = addp("todos", "assigned_id", this.assigned);
             this.cachename = addp(this.cachename, "ticket", this.ticket || "");
             this.cachename = addp(this.cachename, "is_completed", this.completed);
             this.cachelen = (this.todoProvider._dataStore[this.cachename] || {}).length;
             this.getTodos();
         }
        if ("assigned" in event) {
            if (event.assigned.isFirstChange())
                 return;
             this.assigned = event.assigned.currentValue;
             this.cachename = addp("todos", "assigned_id", this.assigned);
             this.cachename = addp(this.cachename, "ticket", this.ticket || "");
             this.cachename = addp(this.cachename, "is_completed", this.completed);
             this.cachelen = (this.todoProvider._dataStore[this.cachename] || {}).length;
             this.getTodos();
         }

             
            // else {
              //   this.pager.limit = this.count;
               //  this.onLoad();
               //  this.is_empty = false;
             //}
         
     }

    ngOnInit()
    {
        if (!this.config.current.user.is_techoradmin)
            return;
        this.hidden = this.simple;
        this.is_empty_list = this.simple;
        this.params = this.navParams.data || {};
        this.pager = { page: 0, limit: this.LIMIT};
        this.params.user = { id: this.params.user_id || this.config.current.user.user_id, name: this.params.user_name || "" };

        if (this.user)
            this.params.user.id = this.user == "all" ? "" : this.user;
        this.assigned = this.params.user.id;
        this.cachename = "todos";
        if (this.params.user.id)
            this.cachename = addp(this.cachename, "assigned_id", this.params.user.id);
        if (this.ticket)
            this.cachename = addp(this.cachename, "ticket", this.ticket || "");  
        this.cachename = addp(this.cachename, "is_completed", this.completed); 
        this.cachelen = (this.todoProvider._dataStore[this.cachename] || {}).length;

        if (this.params.is_empty)
            this.params.count = 0;

        //if (this.params.count !== 0) {
            this.getTodos();
        //}
        //else
        //    this.is_empty = true;
    }

    getTodos(no_cache?)
    {
        this.todoProvider.getTodos(this.assigned, this.ticket, this.completed, this.pager, no_cache);
        this.todoLists = this.todoProvider.todos$[this.cachename];
        //if (!this.cachelen)
        {
            var timer = setTimeout(() => {
                this.busy = true;
            }, 500);
            setTimeout(() => {
                this.busy = false;
            }, 3000);
            this.todoLists.takeUntil(this.unsubscribe$).subscribe(
                data => {
                    clearTimeout(timer);
                    //this.todoLists = this.todoProvider.todos$[this.cachename];
                    var test = [];
                    if (data.length && data.filter(t => t.type == 1).length == 0)
                    {
                       test[0] = data[0];
                       test[0].sub = data;
                       data = test;
                    }
                    this.busy = false;
                    this.is_empty = !data.length;
                    let count = 0, total = 0;
                    for (let k in data) for (let l in data[k].sub) {total++; if (!data[k].sub[l].is_completed) count++};
                    this.undone = count;
                    this.is_empty_list = this.simple && !total;
                });
        }
    }

    AddTodo(tlist)
    {
        //time = time || {};
        //time.account = time.account || this.params.account;
        //time.cachename = this.cachename;
        tlist.hidden = !(tlist.sub || {}).length || !tlist.hidden;
        let myModal = Modal.create(TodoCreatePage, {"list_id" : (tlist || {}).list_id || "" });
        myModal.onDismiss(data => {
             if (data) {
                 this.getTodos(true);
             }
         });
        this.nav.present(myModal);
    }

    EditTodo(todo)
    {
        let myModal = Modal.create(TodoCreatePage, todo);
        myModal.onDismiss(data => {
             if (data) {
                 this.getTodos(true);
             }
         });
        this.nav.present(myModal);
    }

    setDone(todo){
        this.undone = Math.max(todo.is_completed ? --this.undone : ++this.undone, 0);
        ((this.todoProvider._dataStore[this.cachename].filter(t => t.list_id == todo.list_id) || [{}])[0].sub.filter(d => d.id == todo.id)[0] || {}).is_completed = todo.is_completed;
        this.todoProvider.setCompletedTodo(todo.id, todo.is_completed);
    }

    setDate(date, showmonth?, istime?) {
        if (date){
        //var time_offset = this.config.getCurrent("timezone_offset");     
        date = new Date(date.substring(0,23)+"Z");
        //date = new Date(date.setTime(date.getTime() + time_offset*60*60*1000)).toJSON();
        return getDateTime(date, showmonth, istime);
    }
     return null;
    }

    getFixed(value){
        value = (value || "0").toString()
        if (~value.indexOf("."))
            return Number(value).toFixed(2).toString();
        return value;
    }

    ngOnDestroy(){  
        this.unsubscribe$.next();
        this.unsubscribe$.complete(); 
    }

    itemTapped(tlist) {
            tlist.hidden = !(tlist.sub || {}).length || !tlist.hidden;
            var ticket = {"key":tlist.list_ticket_id};
            this.nav.push(TicketDetailsPage, ticket);
         }
}
