import {Page, Config, NavController, NavParams, ViewController} from 'ionic-angular';
import {forwardRef} from 'angular2/core';
import {htmlEscape} from '../../directives/helpers';
import {DataProvider} from '../../providers/data-provider';
import {ClassListComponent} from '../../components/class-list/class-list';
import {SelectListComponent} from '../../components/select-list/select-list';

@Page({
    templateUrl: 'build/pages/timelog/timelog.html',
    directives: [ClassListComponent, forwardRef(() => SelectListComponent)],
})
export class TimelogPage {

    inc : Number;

    constructor(private nav: NavController, private navParams: NavParams, private dataProvider: DataProvider, private config: Config, private view: ViewController) {
    }

    decrement()
    {
        this.timecount = Math.max(this.timecount - this.inc , 0);
    }

    increment()
    {
        this.timecount += this.inc;
    }
    
    onPageLoaded()
    {
        this.isbillable = true;
        this.time = (this.navParams || {}).data || {};

        this.mintime = this.config.current.time_minimum_time || 0.25;
        this.mintime = this.mintime > 0 ? this.mintime : 0.25;

        this.inc = this.config.current.time_hour_increment > 0 ? this.config.current.time_hour_increment : 0.25;

        this.timecount = this.time.hours || this.mintime;

        this.timenote = this.time.note || "";
        this.he = this.config.current.user;

        let account_id = this.time.account_id || this.he.account_id || -1;
        let project_id = this.time.project_id || 0;

        this.selects = {
            "account" : {
                name: "Account", 
                value: (this.time.account || {}).name || this.he.account_name,
                selected: account_id,
                url: "accounts?is_with_statistics=false",
                hidden: false
            },
            "project" : {
                name: "Project", 
                value: this.time.project_name || "Default",
                selected: project_id,
                url: `projects?account=${account_id}&is_with_statistics=false`,
                hidden: false
            },
            "ticket" : {
                name: "Ticket", 
                value: this.time.ticket_number ? `#${this.time.ticket_number}: ${this.time.ticket_subject}` : "Choose",
                selected: this.time.ticket_number || 0,
                url: `tickets?status=open&account=${account_id}&project=${project_id}`,
                hidden: this.time.is_project_log || this.time.task_type_id || false
            },
            "tasktype" : {
                name: "Task Type", 
                value: this.time.task_type || "Choose",
                selected: this.time.task_type_id || 0,
                url: `task_types?account=${account_id}&project=${project_id}`,
                hidden: false
            }
        };
    }

    saveSelect(event){
        let name = event.type;
        let account_id = this.selects.account.selected;
        //change url on related lists
        switch (name) {
            case "account":
            if (this.selects.account.selected === event.id) {
                break;
            }
            this.selects.project.url = `projects?account=${event.id}&is_with_statistics=false`;
            this.selects.project.value = "Default";
            this.selects.project.selected = 0;
            account_id = event.id;
            this.selects.ticket.hidden = false;
            this.selects.project.hidden = false;
            case "project" :
            if (this.selects.project.selected === event.id)
            {
                break;
            }
            // dont change ticket on edit
            if (!this.time.task_type_id){
            this.selects.ticket.hidden = false;
            this.selects.ticket.url = `tickets?status=open&account=${account_id}&project=${event.id}`,
            this.selects.ticket.value = "Default";
            this.selects.ticket.selected = 0;
            }
            this.selects.tasktype.url = `task_types?account=${account_id}&project=${event.id}`,
            this.selects.tasktype.value = "Default";
            this.selects.tasktype.selected = 0;
            break;
        }
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
    }

    onSubmit(form) {
        //{ "ticket" : localStorage.getItem('ticketNumber') } 
        //{ "account" : account, "project": project } 
        //edat = JSON.stringify(new Date(dat2));

        if (this.timecount < this.mintime)
        {
            this.config.alert.error("Oops!", "Not enough time");
            return;
        }
        if (!this.selects.tasktype.selected)
        {
            this.config.alert.error("Oops!", "Please, select Task Type from the list.");
            return;
        }
        if (form.valid) {
            var note = htmlEscape(this.timenote.trim()).substr(0, 5000);

            var isEdit = !!this.time.time_id;
            //TODO if other user changes what id should I write?  
            let data = {
                "tech_id": isEdit ? this.time.user_id : this.he.user_id,
                "project_id": this.selects.project.selected,
                "is_project_log": !this.selects.ticket.selected,
                "ticket_key": this.selects.ticket.selected,
                "account_id": this.selects.account.selected,
                "note_text": note,
                "task_type_id": this.selects.tasktype.selected,
                "hours": this.timecount,
                "is_billable": this.isbillable,
                "date": "", //TODO add date select dat1 ? sdat : "",
                "start_date": "",//dat1 ? sdat : "",
                "stop_date": ""//dat2 ? edat : ""
            };

            this.dataProvider.addTime(this.time.time_id, data, isEdit ? "PUT" : "POST").subscribe(
                data => {
                    this.config.alert.success("", 'Time was successfully added :)');
                    this.close();
                },
                error => {
                    console.log(error || 'Server error');
                }
                );
        }
    }

    setDate(date) {
        return date ? new Date(date) : null;
    }
    
    close() {
        this.view.dismiss();
    }
}
