import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {forwardRef, ViewChild} from '@angular/core';
import {getDateTime, getPickerDateTimeFormat, htmlEscape, linebreaks, getCurrency} from '../../directives/helpers';
import {TimeProvider} from '../../providers/time-provider';
import {ClassListComponent} from '../../components/class-list/class-list';
import {SelectListComponent} from '../../components/select-list/select-list';
import {InvoiceDetailsPage} from '../invoice-details/invoice-details';
import {GravatarPipe, MorePipe, LinebreaksPipe} from '../../pipes/pipes';


@Page({
    templateUrl: 'build/pages/invoice-create/invoice-create.html',
    directives: [ClassListComponent, forwardRef(() => SelectListComponent)],
    pipes: [GravatarPipe, MorePipe, LinebreaksPipe],
})
export class InvoiceCreatePage {

    inc : number;
    isbillable: boolean;
    timecount: any;
    timelogs: any = [];
    expenses: any = [];
    recipients: any = [];
    timecount_nonwork: any;
    mintime: number;
    time: any = {};
    timee: any = {};
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
    this.timelogs = [{"time_id":154101,"project_name":"","user_name":"Eugene Tolmachov","user_email":"eugene@micajah.com","user_id":496558,"note":"","date":"2018-11-14T11:09:00.0000000","stop_time":null,"start_time":null,"hours":0.2500,"fb_id":0,"is_project_log":true,"ticket_id":0,"task_type_id":51873,"task_type":"Onsite - Residential","project_id":0,"account_id":-1,"ticket_number":0,"account_name":"Demo Account Testing","ticket_subject":"","invoice_id":0,"no_invoice":false,"invoice_pseudo_id":"      ","qb_id":0,"payment_id":0,"prepaid_pack_name":"","prepaid_pack_id":0,"user_profile_image":"https://secure.gravatar.com/avatar/8a3bd35c5518ff857b460afd1ddb629d?d=identicon&r=g&s=40","hidden_from_invoice":false,"time_offset":2,"created_user_name":"Eugene Tolmachov","created_user_id":496558,"created_time":"2018-11-14T13:09:00.0000000","updated_user_name":"","updated_user_id":0,"updated_time":null,"non_working_hours":0.0000,"contract_name":"Main","contract_id":81}, {"time_id":154101,"project_name":"","user_name":"Eugene Tolmachov","user_email":"eugene@micajah.com","user_id":496558,"note":"","date":"2018-11-14T11:09:00.0000000","stop_time":null,"start_time":null,"hours":0.2500,"fb_id":0,"is_project_log":true,"ticket_id":0,"task_type_id":51873,"task_type":"Onsite - Residential","project_id":0,"account_id":-1,"ticket_number":0,"account_name":"Demo Account Testing","ticket_subject":"","invoice_id":0,"no_invoice":false,"invoice_pseudo_id":"      ","qb_id":0,"payment_id":0,"prepaid_pack_name":"","prepaid_pack_id":0,"user_profile_image":"https://secure.gravatar.com/avatar/8a3bd35c5518ff857b460afd1ddb629d?d=identicon&r=g&s=40","hidden_from_invoice":false,"time_offset":2,"created_user_name":"Eugene Tolmachov","created_user_id":496558,"created_time":"2018-11-14T13:09:00.0000000","updated_user_name":"","updated_user_id":0,"updated_time":null,"non_working_hours":0.0000,"contract_name":"Main","contract_id":81}];
    this.expenses = [{"expense_id":"faf9d799-f2ff-4ee0-9f4d-e0d65b1ba2f1","project_name":"","user_id":"270","user_name":"Eugene Tolmachov","user_email":"eugene@micajah.com","note":"test20150828","date":"2015-08-28T17:34:00.0000000","amount":10.0000,"fb_expense_id":0,"ticket_id":363663,"ticket_key":"3wnt4m","category_id":"","category":"","project_id":0,"account_id":-1,"ticket_number":4307,"account_name":"SherpaDesk Support","ticket_subject":"test","invoice_id":2626,"billable":false,"invoice_pseudo_id":"g5gngk","vendor":"","fb_staff_id":0,"fb_category_id":0,"fb_client_id":0,"fb_project_id":0,"markup":0,"markup_value":0,"note_internal":"","qb_expense_id":0,"qb_service_id":0,"qb_employee_id":0,"qb_vendor_id":0,"qb_customer_id":0,"qb_sync_token":0,"qb_is_employee":false,"qb_account_id":0,"user_profile_image":"https://secure.gravatar.com/avatar/8a3bd35c5518ff857b460afd1ddb629d?d=identicon&r=g&s=40","hidden_from_invoice":false,"is_technician_payment":false,"payment_id":0,"units":1,"contract_id":0,"contract_name":"Main"},{"expense_id":"cd6ce5f2-fda1-4867-b059-2be23d4b65ad","project_name":"Freshbooks Integration v1","user_id":"1","user_name":"Jon Vickers","user_email":"jon.vickers@micajah.com","note":"I am adding a test expense to the system","date":"2013-07-09T00:00:00.0000000","amount":12.0000,"fb_expense_id":0,"ticket_id":17925,"ticket_key":"xshmey","category_id":"","category":"","project_id":71,"account_id":-1,"ticket_number":798,"account_name":"SherpaDesk Support","ticket_subject":"Freshbooks Configuration Refinements Small","invoice_id":0,"billable":true,"invoice_pseudo_id":"      ","vendor":"","fb_staff_id":0,"fb_category_id":0,"fb_client_id":0,"fb_project_id":0,"markup":0,"markup_value":0,"note_internal":"","qb_expense_id":0,"qb_service_id":0,"qb_employee_id":0,"qb_vendor_id":0,"qb_customer_id":0,"qb_sync_token":0,"qb_is_employee":false,"qb_account_id":0,"user_profile_image":"https://secure.gravatar.com/avatar/57f5bc4e7331308ba723d81cbe59927b?d=identicon&r=g&s=40","hidden_from_invoice":false,"is_technician_payment":false,"payment_id":0,"units":1,"contract_id":0,"contract_name":""},{"expense_id":"faf9d799-f2ff-4ee0-9f4d-e0d65b1ba2f1","project_name":"","user_id":"270","user_name":"Eugene Tolmachov","user_email":"eugene@micajah.com","note":"test20150828","date":"2015-08-28T17:34:00.0000000","amount":10.0000,"fb_expense_id":0,"ticket_id":363663,"ticket_key":"3wnt4m","category_id":"","category":"","project_id":0,"account_id":-1,"ticket_number":4307,"account_name":"SherpaDesk Support","ticket_subject":"test","invoice_id":2626,"billable":false,"invoice_pseudo_id":"g5gngk","vendor":"","fb_staff_id":0,"fb_category_id":0,"fb_client_id":0,"fb_project_id":0,"markup":0,"markup_value":0,"note_internal":"","qb_expense_id":0,"qb_service_id":0,"qb_employee_id":0,"qb_vendor_id":0,"qb_customer_id":0,"qb_sync_token":0,"qb_is_employee":false,"qb_account_id":0,"user_profile_image":"https://secure.gravatar.com/avatar/8a3bd35c5518ff857b460afd1ddb629d?d=identicon&r=g&s=40","hidden_from_invoice":false,"is_technician_payment":false,"payment_id":0,"units":1,"contract_id":0,"contract_name":"Main"},{"expense_id":"cd6ce5f2-fda1-4867-b059-2be23d4b65ad","project_name":"Freshbooks Integration v1","user_id":"1","user_name":"Jon Vickers","user_email":"jon.vickers@micajah.com","note":"I am adding a test expense to the system","date":"2013-07-09T00:00:00.0000000","amount":12.0000,"fb_expense_id":0,"ticket_id":17925,"ticket_key":"xshmey","category_id":"","category":"","project_id":71,"account_id":-1,"ticket_number":798,"account_name":"SherpaDesk Support","ticket_subject":"Freshbooks Configuration Refinements Small","invoice_id":0,"billable":true,"invoice_pseudo_id":"      ","vendor":"","fb_staff_id":0,"fb_category_id":0,"fb_client_id":0,"fb_project_id":0,"markup":0,"markup_value":0,"note_internal":"","qb_expense_id":0,"qb_service_id":0,"qb_employee_id":0,"qb_vendor_id":0,"qb_customer_id":0,"qb_sync_token":0,"qb_is_employee":false,"qb_account_id":0,"user_profile_image":"https://secure.gravatar.com/avatar/57f5bc4e7331308ba723d81cbe59927b?d=identicon&r=g&s=40","hidden_from_invoice":false,"is_technician_payment":false,"payment_id":0,"units":1,"contract_id":0,"contract_name":""}]
    this.recipients = {"id":"","recipients":[{"email":"demo@demo.com","fullname":"Account, Demo","id":"182922","is_accounting_contact":"false","phone":"","type":"tech"},{"email":"demo@demo.com","fullname":"Account, Demo","id":"182922","is_accounting_contact":"false","phone":"","type":"tech"},{"email":"demo@demo.com","fullname":"Account, Demo","id":"182922","is_accounting_contact":"false","phone":"","type":"tech"},{"email":"demo@demo.com","fullname":"Account, Demo","id":"182922","is_accounting_contact":"true","phone":"","type":"tech"},{"email":"demo@demo.com","fullname":"Account, Demo","id":"182922","is_accounting_contact":"true","phone":"","type":"tech"}]};
    console.log(this.timelogs);
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
                this.title = "Add Invoice";
            if (this.time.invoice_id > 0)
            {
                this.title = `Invoiced #${this.time.invoice_id} on\u00a0` + this.setDate(this.AddHours(this.time.date, this.time.time_offset), false, true);
            }

            this.mintime = this.config.getCurrent("time_minimum_time") || 0.25;
            this.mintime = this.mintime > 0 ? this.mintime : 0.25;

            this.isbillable = this.time.no_invoice;

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
                    hidden: false,
                    is_disabled: this.time.ticket_number
                },
                "project" : {
                    name: "Project", 
                    value:  this.time.project_name || (recent.project || {}).value || "Default",
                    selected: project_id,
                    url: `projects?account=${account_id}&is_with_statistics=false`,
                    hidden: false,
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
                    url: this.time.ticket_number ? `task_types?ticket=${this.time.ticket_number}` : `task_types?account=${account_id}`,
                    hidden: false
                },
                 "contract" : { 
                    name: "Contract", 
                    value: this.time.contract_name || (recent.contract || {}).value || "Choose",
                    selected: this.time.contract_id || this.config.getRecent("contract").selected || 0,
                    url: `contracts?account_id=${account_id}`,
                    hidden: false
                },
                "prepaidpack" : {
                    name: "PrePaid Pack", 
                    value: this.time.prepaid_pack_name || (recent.prepaidpack || {}).value || "Choose",
                    selected: this.time.prepaid_pack_id || this.config.getRecent("prepaidpack").selected || 0,
                    url: `prepaid_packs?contract_id=${contract_id}`,
                    hidden: false
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
        this.selects[name].value = event.name;
    }

    onSubmit(form?) {
        this.config.setRecent({"account": this.selects.account,
                                               "project": this.selects.project,
                                               "ticket": this.selects.ticket,
                                               "contract": this.selects.contract,
                                                "prepaidpack": this.selects.prepaidpack});
 /* add time modal */

            let data = {
                "project_id": this.selects.project.selected,
                "is_project_log": !this.selects.ticket.selected,
                "ticket_key": this.selects.ticket.selected,
                "account_id": this.selects.account.selected,
                "task_type_id": this.selects.tasktype.selected,
                "prepaid_pack_id" : this.selects.prepaidpack.selected,
                "no_invoice": this.isbillable,
                "contract_id": this.selects.contract.selected,
                "is_local_time": true,
            };
            console.log(data,"data");
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
    getCurrency(value) {
        return getCurrency(value);
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
