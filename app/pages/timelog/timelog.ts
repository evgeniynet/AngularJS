import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {forwardRef, ViewChild} from '@angular/core';
import {getDateTime, getPickerDateTimeFormat, htmlEscape} from '../../directives/helpers';
import {TimeProvider} from '../../providers/time-provider';
import {ClassListComponent} from '../../components/class-list/class-list';
import {SelectListComponent} from '../../components/select-list/select-list';

@Page({
    templateUrl: 'build/pages/timelog/timelog.html',
    directives: [ClassListComponent, forwardRef(() => SelectListComponent)],
})
export class TimelogPage {

    inc : number;
    isbillable: boolean;
    timecount: any;
    mintime: number;
    time: any = {};
    timenote: string;
    title: string;
    he: any;
    selects: any = {};
    displayFormat: string;
    minuteValues: Array<number> = [0, 15, 30, 45, 0];
    //@ViewChild('starttime') starttime:DateTime;
    //@ViewChild('stoptime') stoptime:DateTime;

    constructor(private nav: Nav, private navParams: NavParams, private timeProvider: TimeProvider, private config: Config, private view: ViewController) {
    }

    decrement()
    {
        this.timecount = Math.max(Number(this.timecount) - this.inc, 0).toFixed(2);
    }

    increment()
    {
        this.timecount = (Number(this.timecount) + this.inc).toFixed(2);
    }

    onPageWillEnter() {
        if (this.title.length > 8)
            this.view.setBackButtonText('');
    }

    ngAfterViewInit() {
      //console.log(this.starttime.min);
      //this.starttime.displayFormat = this.displayFormat;
//console.log(this.starttime.displayFormat);

    }
    
    ngOnInit()
    {
        this.time = this.navParams.data || {};

        let name = (this.time.user_name + " " + this.time.user_email).trim().split(' ')[0];
        if (this.time.time_id)
        this.title = `Timelog #${this.time.time_id} by ${name} @ ` + this.setDate(this.time.date, false, true);
        else if (this.time.number)
            this.title = `Add Time to #${this.time.number} ${this.time.subject}`;
        else
            this.title = "Add Time";
        
        this.mintime = this.config.getCurrent("time_minimum_time") || 0.25;
        this.mintime = this.mintime > 0 ? this.mintime : 0.25;

        this.isbillable = typeof this.time.billable === 'undefined' ? true : this.time.billable;

        this.inc = this.config.getCurrent("time_hour_increment") > 0 ? this.config.getCurrent("time_hour_increment") : 0.25;

        this.displayFormat = getPickerDateTimeFormat(false, true);

        if (this.inc >= 1)
                this.minuteValues = [0];   
        else if (this.inc != 0.25)
        { 
            this.minuteValues = [];
            let min = 0;
            do { this.minuteValues.push(min); min += 60*this.inc;}
            while (min < 60);
            this.minuteValues.push(0);
        }

        this.timecount = (this.time.hours || this.mintime).toFixed(2);

        this.timenote = this.time.note || "";
        this.he = this.config.getCurrent("user");

        let account_id = (this.time.account || {}).id || this.time.account_id || this.he.account_id || -1;
        let project_id = (this.time.project || {}).id || this.time.project_id || 0;

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

        let hours = Number(this.timecount);

        if (hours < this.mintime)
        {
            this.nav.alert("Not enough time", true);
            return;
        }
        if (!this.selects.tasktype.selected)
        {
            this.nav.alert("Please, select Task Type from the list.", true);
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
                "hours": hours,
                "is_billable": this.isbillable,
                "date": this.time.start_time || "", 
                "start_date": this.time.start_time || "",
                "stop_date": this.time.stop_time || ""
            };

            this.timeProvider.addTime(this.time.time_id, data, isEdit ? "PUT" : "POST").subscribe(
                data => {
                    this.nav.alert('Time was successfully added :)');
                    this.close();
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

    setMinTime(date) {
        return (date || this.time.date || new Date().toJSON()).substring(0,4);
    }

    setMaxTime(date) {
        return (date || this.time.date || new Date().toJSON()).substring(0,4);
    }

    getStartDate(time) {
        return (time || this.time.date || new Date().toJSON()).substring(0,19);
    }

    setStartDate(time){
        if (time)
           this.time.start_time = time.substring(0,19);
    }

    setStopDate(time){
        if (time)
           this.time.stop_time = time.substring(0,19);
    }


    getFixed(value) {
        console.log(value);
        return Number(value || "0").toFixed(2).toString();
    }
    
    close() {
        this.view.dismiss();
    }
}
