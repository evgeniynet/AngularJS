import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {forwardRef, ViewChild} from '@angular/core';
import {getDateTime, getPickerDateTimeFormat, htmlEscape, linebreaks} from '../../directives/helpers';
import {TimeProvider} from '../../providers/time-provider';
import {ClassListComponent} from '../../components/class-list/class-list';
import {SelectListComponent} from '../../components/select-list/select-list';
import {InvoiceDetailsPage} from '../invoice-details/invoice-details';

@Page({
    templateUrl: 'build/pages/timelog/timelog.html',
    directives: [ClassListComponent, forwardRef(() => SelectListComponent)],
})
export class TimelogPage {

    inc : number;
    isno_invoice: boolean;
    istaxable: boolean = true;
    timecount: any;
    timecount_nonwork: any;
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
    //start_stop_hours: number = 0;
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

    decrement_nonwork()
    {
        this.timecount_nonwork = Math.max(Number(this.timecount_nonwork) - this.inc, 0).toFixed(2);
    }

    increment_nonwork()
    {
        this.timecount_nonwork = (Number(this.timecount_nonwork) + this.inc).toFixed(2);
    }

    ngAfterViewInit() {
      //console.log(this.config.current.recent);
      //this.starttime.displayFormat = this.displayFormat;
//console.log(this.starttime.displayFormat);

}

AddHours(date, hours)
{
    if (date){
        date = new Date(date.substring(0,19)+"Z");
        date = new Date(date.setTime(date.getTime() + hours*60*60*1000)).toJSON();
        return date;
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
                this.title = `Timelog #${this.time.time_id} by\u00a0${name} on\u00a0` + this.setDate(this.time.created_time, false, true);
                //fix timezone
                this.start_time = this.AddHours(this.time.start_time, this.time.time_offset);
                this.stop_time = this.AddHours(this.time.stop_time, this.time.time_offset);
                //if (this.start_time && this.stop_time)
                //    this.start_stop_hours = Number(Math.round((+(new Date(this.stop_time)) - +(new Date(this.start_time))) / 60000)/60);
            }
            else if (this.time.number)
                this.title = `#${this.time.number} ${this.time.subject}`;
            else
                this.title = "Add Time";
            if (this.time.invoice_id > 0)
            {
                this.title = `Invoiced #${this.time.invoice_id} on\u00a0` + this.setDate(this.AddHours(this.time.date, this.time.time_offset), false, true);
            }

            this.mintime = this.config.getCurrent("time_minimum_time") || 0.25;
            this.mintime = this.mintime > 0 ? this.mintime : 0.25;

            this.isno_invoice = this.time.no_invoice;
            this.istaxable = this.time.is_taxable;

            this.inc = this.config.getCurrent("time_hour_increment") > 0 ? this.config.getCurrent("time_hour_increment") : 0.25;

            this.displayFormat = getPickerDateTimeFormat(false, true);

            if (this.inc >= 1)
                this.minuteValues = [0];   
            else if (this.inc != 0.25)
            { 
                this.minuteValues = [];
                let min = 0;
                //do { this.minuteValues.push(min); min += 60*this.inc;}
                do { this.minuteValues.push(min); min += 5;}
                while (min < 60);
                this.minuteValues.push(0);
            }


            this.timecount = (this.time.hours || this.mintime).toFixed(2);
            this.timecount_nonwork = (this.time.non_working_hours || 0).toFixed(2);
            if (this.timecount_nonwork<0) 
                this.timecount_nonwork = 0;
            this.timenote = linebreaks(this.time.note || "", true);
            this.he = this.config.getCurrent("user");

            let recent : any = {};

            if (!this.time.number && !this.time.time_id && !(this.time.account || {}).id)
            {
                recent = this.config.current.recent || {};
            }

            let account_id = (this.time.account || {}).id || this.time.account_id || (recent.account || {}).selected || this.he.account_id || -1;
            let contract_id = (this.time.contract || {}).id || this.time.contract_id || (recent.contract || {}).selected || 0;
            let project_id = (this.time.project || {}).id || this.time.project_id || (recent.project || {}).selected || 0;

            this.selects = {
                "account" : {
                    name: "Account", 
                    value:  (this.time.account || {}).name || this.time.account_name || (recent.account || {}).value || this.he.account_name,
                    selected: account_id,
                    url: "accounts?is_with_statistics=false",
                    hidden: this.time.is_fixed,
                    is_disabled: this.time.ticket_number
                },
                "project" : {
                    name: "Project", 
                    value:  this.time.project_name || (recent.project || {}).value || "Default",
                    selected: project_id,
                    url: `projects?account=${account_id}&is_with_statistics=false`,
                    hidden: this.time.is_fixed,
                    is_disabled: this.time.ticket_number
                },
                "ticket" : {
                    name: "Ticket", 
                    value: this.time.ticket_number ? `#${this.time.ticket_number}: ${this.time.ticket_subject}` : "Choose (optional)",
                    selected: this.time.ticket_number || 0,
                    url: `tickets?status=open&account=${account_id}&project=${project_id}`,
                    hidden: this.time.is_project_log || false,
                    is_disabled: this.time.task_type_id
                },
                "tasktype" : { 
                    name: "Task Type", 
                    value: this.time.task_type || (recent.tasktype || {}).value || "Choose",
                    selected: this.time.task_type_id || this.config.getRecent("tasktype").selected || 0,
                    url: this.time.ticket_number ? `task_types?ticket=${this.time.ticket_number}` : `task_types?account=${account_id}`
                },
                 "contract" : { 
                    name: "Contract", 
                    value: this.time.contract_name || (recent.contract || {}).value || "Choose",
                    selected: this.time.contract_id || this.config.getRecent("contract").selected || 0,
                    url: `contracts?account_id=${account_id}`,
                    hidden: this.time.is_fixed
                },
                "prepaidpack" : {
                    name: "PrePaid Pack", 
                    value: this.time.prepaid_pack_name || (recent.prepaidpack || {}).value || "Choose",
                    selected: this.time.prepaid_pack_id || this.config.getRecent("prepaidpack").selected || 0,
                    url: `prepaid_packs?contract_id=${contract_id}`,
                    hidden: this.time.is_fixed
                }
            };
        }

        saveSelect(event){
            let name = event.type;
            let account_id = this.selects.account.selected;
            let ticket_id = this.selects.ticket.selected;
            let project_id = this.selects.project.selected;
            let contract_id = this.selects.contract.selected;
            let prepaidpack_id = this.selects.prepaidpack.selected;    
        //change url on related lists
        switch (name) {
            case "account":
            if (this.selects.account.selected === event.id) {
                break;
            }
            this.selects.project.url = `projects?account=${event.id}&is_with_statistics=false`;
            this.selects.project.value = "Default";
            this.selects.project.selected = 0;
            project_id = 0;
            this.selects.contract.url = `contracts?account_id=${event.id}`;
            this.selects.contract.value = "Default";
            this.selects.contract.selected = 0;
            contract_id = 0;
            this.selects.prepaidpack.url = `prepaid_packs?contract_id=0`;
            this.selects.prepaidpack.value = "Choose (optional)";
            this.selects.prepaidpack.selected = 0;
            account_id = event.id;
            this.selects.ticket.hidden = this.time.is_project_log || this.time.task_type_id || false;
            if (!this.time.task_type_id){
                this.selects.ticket.url = `tickets?status=open&account=${account_id}&project=${project_id}`,
                this.selects.ticket.value = "Choose (optional)";
                this.selects.ticket.selected = 0;
            }
            this.selects.project.hidden = !this.config.current.is_project_tracking;
            break;
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
            project_id = event.id;
            break;
            case "contract" :
            if (this.selects.contract.selected === event.id)
            {
                break;
            }
            // dont change ticket on edit
            this.selects.prepaidpack.url = `prepaid_packs?contract_id=${event.id}`;
            this.selects.prepaidpack.value = "Choose (optional)";
            this.selects.prepaidpack.selected = 0;
            contract_id = event.id;
            break;

            case "ticket" :
            if (this.selects.ticket.selected === event.id)
            {
                break;
            }
            ticket_id = event.id;
            break;
        }
        this.selects.tasktype.url = `task_types?ticket=${ticket_id}&account=${account_id}&project=${project_id}&contract=${contract_id}`;
        this.selects.tasktype.value = "Choose";
        this.selects.tasktype.selected = 0;
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name || "Default";
    }

    onSubmit(form) {
        if (this.time.invoice_id)
        {
            this.viewInvoice();
            return;
        }
        //{ "ticket" : localStorage.getItem('ticketNumber') } 
        //{ "account" : account, "project": project } 
        //edat = JSON.stringify(new Date(dat2));
        let hours = Number(this.timecount);
        let non_work_hours = Number(this.timecount_nonwork);

        if (hours + this.timecount_nonwork < this.mintime)
        {
            this.nav.alert("Not enough time", true);
            return;
        }
        
        if (this.start_time && this.stop_time && hours > this.getInterval())
        {
            this.nav.alert("Hours value should be less or equal to Start/Stop range.", true);
            return;
        }
        console.log(this.selects.contract.selected,"this.selects.contract.selected");
        if (!this.selects.contract.selected || this.selects.contract.selected == 0 || this.selects.contract.selected == 82)
        {
            this.nav.alert("Please, select Contract from the list.", true);
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
            var start_time = this.start_time;
            if (this.endsWith(this.start_time, "Z"))
                start_time = start_time.substring(0,19);
            var stop_time = this.stop_time;
            if (this.endsWith(this.stop_time, "Z"))
                stop_time = stop_time.substring(0,19);
            var date = this.time.date || (new Date()).toJSON();
            if (start_time)
            {
                date = this.AddHours(start_time, -1*this.UserDateOffset);
            }
            //TODO if other user changes what id should I write?  
            let data = {
                "tech_id": isEdit ? this.time.user_id : this.he.user_id,
                "project_id": this.selects.project.selected,
                "is_project_log": !this.selects.ticket.selected,
                "ticket_key": this.selects.ticket.selected,
                "account_id": this.selects.account.selected,
                "note_text": note,
                "task_type_id": this.selects.tasktype.selected,
                "prepaid_pack_id" : this.selects.prepaidpack.selected,
                "hours": hours,
                "no_invoice": this.isno_invoice,
                "is_taxable": this.istaxable,
                "date": date || "", 
                "start_date": start_time || "",
                "stop_date": stop_time || "",
                "non_working_hours": non_work_hours,
                "contract_id": this.selects.contract.selected,
                "is_local_time": true,
            };

            this.timeProvider.addTime(this.time.time_id, data, isEdit ? "PUT" : "POST").subscribe(
                res => {
                    //store recent
                    if (!this.time.number && !this.time.time_id && !(this.time.account || {}).id)
                    {
                        this.config.setRecent({"account": this.selects.account,
                                               "project": this.selects.project,
                                               "tasktype": this.selects.tasktype,
                                               "contract": this.selects.contract,
                                                "prepaidpack": this.selects.prepaidpack});
                    }
                    if (isEdit){
                        this.time.start_time = this.AddHours(data.start_date, -1*this.UserDateOffset);
                        this.time.stop_time = this.AddHours(data.stop_date, -1*this.UserDateOffset);
                        this.time.hours = data.hours;
                        this.time.non_working_hours = data.non_working_hours;
                        this.time.no_invoice = data.no_invoice;
                        this.time.is_taxable = data.is_taxable;
                    }
                    else
                    {
                        var tdate = data.date || (new Date()).toJSON();
                        var tt = {
                            time_id:0,
                            account_id:data.account_id,
                            account_name:this.selects.account.value,
                            no_invoice:data.no_invoice,
                            is_taxable : data.is_taxable,
                            date:tdate,
                            hours:data.hours,
                            non_working_hours:data.non_working_hours,
                            is_project_log:data.is_project_log,
                            note:data.note_text,
                            project_id:data.project_id,
                            project_name:this.selects.project.value,
                            start_time: this.AddHours(data.start_date, -1*this.UserDateOffset),
                            stop_time: this.AddHours(data.stop_date, -1*this.UserDateOffset),
                            time_offset:this.UserDateOffset,
                            task_type:this.selects.tasktype.value,
                            task_type_id:data.task_type_id,
                            contract_name:this.selects.contract.value,
                            contract_id:data.contract_id,
                            prepaid_pack:this.selects.prepaidpack.value,
                            prepaid_pack_id:data.prepaid_pack_id,
                            ticket_number:data.ticket_key,
                            ticket_subject:this.selects.ticket.value,
                            user_email:this.he.email,
                            user_id:this.he.user_id,
                            user_name :this.he.firstname + " " + this.he.lastname};
                            (this.timeProvider._dataStore[this.time.cachename] || []).splice(0, 0, tt);
                        }
                        this.nav.alert('Time was successfully ' + (isEdit ? 'updated' : 'added') + ' :)');
                        this.close(tt);
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
        return (date || this.time.date || (new Date()).toJSON().substring(0,4));
    }

    setMaxTime(date) {
        return (date || this.time.date || (new Date()).toJSON().substring(0,4));
    }

    getStartDate(time) {
        return (time || this.time.date || (new Date()).toJSON().substring(0,19));
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
        let timecount : number = this.getInterval();
        this.timecount = timecount.toFixed(2);
    }

    endsWith(str, search)
    {
        str = str || "";
        var this_len = str.length;
        return str.substring(this_len - search.length, this_len) === search;
    }

    getInterval()
    {
        var start_time = this.start_time;
        if (!this.endsWith(this.start_time, "Z"))
            start_time += "Z"; 
        var stop_time = this.stop_time;
        if (!this.endsWith(this.stop_time, "Z"))
            stop_time += "Z"; 
        return Number(Math.round((+(new Date(stop_time)) - +(new Date(start_time))) / 60000)/60);
    }


    getFixed(value) {
        return Number(value || "0").toFixed(2).toString();
    }
    
    close(data?) {
        this.view.dismiss(data);
    }

    viewInvoice() {
        let invoice = {
            account_name : this.time.account_name,
            id: this.time.invoice_id,
            account_id: this.time.account_id,
            project_id: this.time.project_id
        };

        this.nav.push(InvoiceDetailsPage, invoice);
    }
}
