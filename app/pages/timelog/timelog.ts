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
    title: string = "";
    he: any;
    selects: any = {};
    displayFormat: string;
    minuteValues: Array<number> = [0, 15, 30, 45, 0];
    start_time: string = "";
    stop_time: string = "";
    UserDateOffset: number = -5;
    start_stop_hours: number = 0;
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

    ngAfterViewInit() {
      //console.log(this.config.current.recent);
      //this.starttime.displayFormat = this.displayFormat;
//console.log(this.starttime.displayFormat);

}

AddHours(date, hours)
{
    if (date){
        if (date.length == 19)
            date = date.slice(0,-3);
        let temp = new Date(date);
        return new Date(temp.setTime(temp.getTime() + (hours*60*60*1000))).toJSON();
    }
    return date;
}

ngOnInit()
{
    this.UserDateOffset = this.config.getCurrent("timezone_offset");
    this.time = this.navParams.data || {};

    let name = (this.time.user_name + " " + this.time.user_email).trim().split(' ')[0];
            if (this.time.time_id)
            {
                this.title = `Timelog #${this.time.time_id} by\u00a0${name} on\u00a0` + this.setDate(this.time.date, false, true);
                //fix timezone
                this.start_time = this.AddHours(this.time.start_time, this.time.time_offset);
                this.stop_time = this.AddHours(this.time.stop_time, this.time.time_offset);
                if (this.start_time && this.stop_time)
                    this.start_stop_hours = Number(Math.round((+(new Date(this.stop_time)) - +(new Date(this.start_time))) / 60000)/60);
            }
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

            let recent : any = {};

            if (!this.time.number && !this.time.time_id && !(this.time.account || {}).id)
            {
                recent = this.config.current.recent || {};
            }

            let account_id = (this.time.account || {}).id || this.time.account_id || (recent.account || {}).selected || this.he.account_id || -1;
            let project_id = (this.time.project || {}).id || this.time.project_id || (recent.project || {}).selected || 0;


            this.selects = {
                "account" : {
                    name: "Account", 
                    value:  (this.time.account || {}).name || this.time.account_name || (recent.account || {}).value || this.he.account_name,
                    selected: account_id,
                    url: "accounts?is_with_statistics=false",
                    hidden: false
                },
                "project" : {
                    name: "Project", 
                    value:  this.time.project_name || (recent.project || {}).value || "Default",
                    selected: project_id,
                    url: `projects?account=${account_id}&is_with_statistics=false`,
                    hidden: false
                },
                "ticket" : {
                    name: "Ticket", 
                    value: this.time.ticket_number ? `#${this.time.ticket_number}: ${this.time.ticket_subject}` : "Choose (optional)",
                    selected: this.time.ticket_number || 0,
                    url: `tickets?status=open&account=${account_id}&project=${project_id}`,
                    hidden: this.time.is_project_log || this.time.task_type_id || false
                },
                "tasktype" : {
                    name: "Task Type", 
                    value: this.time.task_type || (recent.tasktype || {}).value || "Choose",
                    selected: this.time.task_type_id || this.config.getRecent("tasktype").selected || 0,
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
            this.selects.ticket.hidden = this.time.is_project_log || this.time.task_type_id || false;
            this.selects.project.hidden = !this.config.current.is_project_tracking;
            case "project" :
            if (this.selects.project.selected === event.id)
            {
                break;
            }
            // dont change ticket on edit
            if (!this.time.task_type_id){
                this.selects.ticket.hidden = this.time.is_project_log || this.time.task_type_id || false;
                this.selects.ticket.url = `tickets?status=open&account=${account_id}&project=${event.id}`,
                this.selects.ticket.value = "Choose (optional)";
                this.selects.ticket.selected = 0;
            }
            this.selects.tasktype.url = `task_types?account=${account_id}&project=${event.id}`,
            this.selects.tasktype.value = "Choose";
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
        if (this.start_stop_hours && hours > this.start_stop_hours)
        {
            this.nav.alert("Hours value should be lesser or equal than Start/Stop range.", true);
            return;
        }
        if (!this.selects.tasktype.selected)
        {
            this.nav.alert("Please, select Task Type from the list.", true);
            return;
        }
        if (form.valid) {
            //proof double click
            if (this.time.in_progress && Date.now() - this.time.in_progress < 1500) {return;}
            this.time.in_progress = Date.now();
            var note = htmlEscape(this.timenote.trim()).substr(0, 5000);

            var isEdit = !!this.time.time_id;
            var time_offset = -1 * (isEdit ? this.time.time_offset : this.UserDateOffset);
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
                "date": this.AddHours(this.start_time, time_offset) || "", 
                "start_date": this.AddHours(this.start_time, time_offset)  || "",
                "stop_date": this.AddHours(this.stop_time, time_offset)  || ""
            };

            this.timeProvider.addTime(this.time.time_id, data, isEdit ? "PUT" : "POST").subscribe(
                res => {
                    //store recent
                    if (!this.time.number && !this.time.time_id && !(this.time.account || {}).id)
                    {
                        this.config.setRecent({"account": this.selects.account,
                                               "project": this.selects.project,
                                               "tasktype": this.selects.tasktype});
                    }
                    if (isEdit){
                        this.time.start_time = data.start_date;
                        this.time.stop_time = data.stop_date;
                        this.time.hours = data.hours;
                        this.time.is_billable = data.is_billable;
                    }
                    else
                    {
                        var tdate = data.date || this.AddHours(new Date(), this.UserDateOffset);
                        var tt = {
                            time_id:0,
                            account_id:data.account_id,
                            account_name:this.selects.account.value,
                            billable:data.is_billable,
                            date:tdate,
                            hours:data.hours,
                            is_project_log:data.is_project_log,
                            note:data.note_text,
                            project_id:data.project_id,
                            project_name:this.selects.project.value,
                            start_time:data.start_date,
                            stop_time:data.stop_date,
                            time_offset:time_offset,
                            task_type:this.selects.tasktype.value,
                            task_type_id:data.task_type_id,
                            ticket_number:data.ticket_key,
                            ticket_subject:this.selects.ticket.value,
                            user_email:this.he.email,
                            user_id:this.he.user_id,
                            user_name :this.he.firstname + " " + this.he.lastname};
                            (this.timeProvider._dataStore[this.time.cachename] || []).splice(0, 0, tt);
                        }
                        this.nav.alert('Time was successfully ' + (isEdit ? 'updated' : 'added') + ' :)');
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
        return (date || this.time.date || this.AddHours(new Date(), this.UserDateOffset)).substring(0,4);
    }

    setMaxTime(date) {
        return (date || this.time.date || this.AddHours(new Date(), this.UserDateOffset)).substring(0,4);
    }

    getStartDate(time) {
        return (time || this.time.date || this.AddHours(new Date(), this.UserDateOffset)).substring(0,19);
    }

    setStartDate(time){
        if (time)
        {
            this.start_time = time.substring(0,19);
            if (this.stop_time)
            {
               this.updateHours();
            }
        }
    }

    setStopDate(time){
        if (time)
        {
            this.stop_time = time.substring(0,19);
            if (this.start_time)
            {
                this.updateHours();
            }
        }
    }

    updateHours()
    {
        let timecount : number = Math.round((+(new Date(this.stop_time)) - +(new Date(this.start_time))) / 60000);
                if (timecount < 0)
                {
                    this.start_time = this.AddHours(this.start_time, -24);
                    this.start_stop_hours = Number(24 + timecount/60);
                }
                else
                    this.start_stop_hours = Number(timecount/60);
                this.timecount = this.start_stop_hours.toFixed(2);
    }


    getFixed(value) {
        return Number(value || "0").toFixed(2).toString();
    }
    
    close() {
        this.view.dismiss();
    }
}
