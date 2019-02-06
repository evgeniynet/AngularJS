import {Page, Config, Nav, NavParams, Modal} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {TodoCreatePage} from '../todo-create/todo-create';
import {TodoListComponent} from '../../components/components';
import {SelectListComponent} from '../../components/select-list/select-list';

@Page({
    templateUrl: 'build/pages/todos/todos.html',
    directives: [forwardRef(() => SelectListComponent), TodoListComponent],
})
export class TodosPage {

    is_empty: boolean = false;
    params: any;
    selects: any;
    test: boolean;
    completed: string;
    assigned: string;
    //undone: number = 0;
    
    constructor(private nav: Nav, private config: Config, private navParams: NavParams) {
    }

    onPageLoaded()
    {
        this.params = this.navParams.data || {};
        //this.pager = { page: 0 };
        this.params.user = { id: this.params.user_id || this.config.current.user.user_id, name: this.params.user_name || "" };
        this.params.tech = { id: this.params.tech_id || 0, name: this.params.tech_name || "" };
        /*let cachename = addp("todos", "assigned_id", this.params.user.id);
           this.todoProvider.todos$[cachename].subscribe(
                data => {
                    let count = 0;
                    for (let k in data) for (let l in data[k].sub) if (!data[k].sub[l].is_completed) count++;
                    this.undone = count;
                });
                */

                this.selects = {
            "completed": {
                name: "Completed",
                value: "All",
                selected: "",
                hidden: false,
                items: [
                    { "name": 'All', "id": "" },
                    { "name": 'Completed', "id": "1" },
                    { "name": 'UnCompleted', "id": "0" },
                ]
            },
            "tech" : {
                name: "Tech", 
                value: "--All " +this.config.current.names.tech.p+" --",
                default: "--All " +this.config.current.names.tech.p+" --",
                isnew_disabled: true,
                selected: (this.params.tech || {}).id || 0,
                url: "technicians",
                hidden: false
            }
        };
        }

    saveSelect(event){
        let name = event.type;
        if (name == "completed")
        {
            this.selects[name].selected = event.id;
            this.selects[name].value = event.name;
            this.completed = this.selects[name].selected;
        }
        else if (name == "tech")
        {
            this.selects[name].selected = event.id;
            this.selects[name].value = event.name;
            this.assigned = this.selects[name].selected;
        }
    }

    AddTodo()
    {
        let myModal = Modal.create(TodoCreatePage, {"list_id": "" });
        this.nav.present(myModal);
    }
    toggle(){
        this.test = !this.test;
        if (this.test){
            setTimeout(() => {
        let t = document.getElementsByClassName("open-filter");
        t = t[t.length - 1];
        t && t.focus();
        }, 500);
        }
    }

}