import {Page, Config, Nav, NavParams, Modal, ViewController} from 'ionic-angular';
import {forwardRef, ViewChild} from '@angular/core';
import {getDateTime, getPickerDateTimeFormat, htmlEscape, getFullName, linebreaks, getCurrency} from '../../directives/helpers';
import {TimeProvider} from '../../providers/time-provider';
import {DataProvider} from '../../providers/data-provider';
import {ClassListComponent} from '../../components/class-list/class-list';
import {SelectListComponent} from '../../components/select-list/select-list';
import {InvoiceDetailsPage} from '../invoice-details/invoice-details';
import {ExpenseCreatePage} from '../../pages/expense-create/expense-create';
import {GravatarPipe, MorePipe, LinebreaksPipe} from '../../pipes/pipes';
import {TimelogPage} from '../../pages/timelog/timelog'; 
import {AddUserModal, BasicSelectModal, InfinitySelectModal} from '../modals/modals';

@Page({
    templateUrl: 'build/pages/invoice-create/invoice-create.html',
    directives: [ClassListComponent, forwardRef(() => SelectListComponent)],
    pipes: [GravatarPipe, MorePipe, LinebreaksPipe],
})
export class InvoiceCreatePage {

    inc : number;
    isbillable: boolean;
    contract: any = [];
    timecount: any;
    timelogs: any = [];
    pager: any = [];
    expenses: any = [];
    recipients: any = [];
    timecount_nonwork: any;
    mintime: number;
    data: any = {};
    timee: any = {};
    timenote: string;
    title: string = "";
    he: any;
    selects: any = {};
    displayFormat: string;
    UserDateOffset: number = -5;

    constructor(private nav: Nav, private navParams: NavParams, private dataProvider: DataProvider, private timeProvider: TimeProvider, private config: Config, private view: ViewController) {
    this.timelogs = [{"time_id":154101,"project_name":"","user_name":"Eugene Tolmachov","user_email":"eugene@micajah.com","user_id":496558,"note":"","date":"2018-11-14T11:09:00.0000000","stop_time":null,"start_time":null,"hours":0.2500,"fb_id":0,"is_project_log":true,"ticket_id":0,"task_type_id":51873,"task_type":"Onsite - Residential","project_id":0,"account_id":-1,"ticket_number":0,"account_name":"Demo Account Testing","ticket_subject":"","invoice_id":0,"no_invoice":false,"invoice_pseudo_id":"      ","qb_id":0,"payment_id":0,"prepaid_pack_name":"","prepaid_pack_id":0,"user_profile_image":"https://secure.gravatar.com/avatar/8a3bd35c5518ff857b460afd1ddb629d?d=identicon&r=g&s=40","hidden_from_invoice":false,"time_offset":2,"created_user_name":"Eugene Tolmachov","created_user_id":496558,"created_time":"2018-11-14T13:09:00.0000000","updated_user_name":"","updated_user_id":0,"updated_time":null,"non_working_hours":0.0000,"contract_name":"Main","contract_id":81}, {"time_id":154101,"project_name":"","user_name":"Eugene Tolmachov","user_email":"eugene@micajah.com","user_id":496558,"note":"","date":"2018-11-14T11:09:00.0000000","stop_time":null,"start_time":null,"hours":0.2500,"fb_id":0,"is_project_log":true,"ticket_id":0,"task_type_id":51873,"task_type":"Onsite - Residential","project_id":0,"account_id":-1,"ticket_number":0,"account_name":"Demo Account Testing","ticket_subject":"","invoice_id":0,"no_invoice":false,"invoice_pseudo_id":"      ","qb_id":0,"payment_id":0,"prepaid_pack_name":"","prepaid_pack_id":0,"user_profile_image":"https://secure.gravatar.com/avatar/8a3bd35c5518ff857b460afd1ddb629d?d=identicon&r=g&s=40","hidden_from_invoice":false,"time_offset":2,"created_user_name":"Eugene Tolmachov","created_user_id":496558,"created_time":"2018-11-14T13:09:00.0000000","updated_user_name":"","updated_user_id":0,"updated_time":null,"non_working_hours":0.0000,"contract_name":"Main","contract_id":81}];
    this.expenses = [{"expense_id":"faf9d799-f2ff-4ee0-9f4d-e0d65b1ba2f1","project_name":"","user_id":"270","user_name":"Eugene Tolmachov","user_email":"eugene@micajah.com","note":"test20150828","date":"2015-08-28T17:34:00.0000000","amount":10.0000,"fb_expense_id":0,"ticket_id":363663,"ticket_key":"3wnt4m","category_id":"","category":"","project_id":0,"account_id":-1,"ticket_number":4307,"account_name":"SherpaDesk Support","ticket_subject":"test","invoice_id":2626,"billable":false,"invoice_pseudo_id":"g5gngk","vendor":"","fb_staff_id":0,"fb_category_id":0,"fb_client_id":0,"fb_project_id":0,"markup":0,"markup_value":0,"note_internal":"","qb_expense_id":0,"qb_service_id":0,"qb_employee_id":0,"qb_vendor_id":0,"qb_customer_id":0,"qb_sync_token":0,"qb_is_employee":false,"qb_account_id":0,"user_profile_image":"https://secure.gravatar.com/avatar/8a3bd35c5518ff857b460afd1ddb629d?d=identicon&r=g&s=40","hidden_from_invoice":false,"is_technician_payment":false,"payment_id":0,"units":1,"contract_id":0,"contract_name":"Main"},{"expense_id":"cd6ce5f2-fda1-4867-b059-2be23d4b65ad","project_name":"Freshbooks Integration v1","user_id":"1","user_name":"Jon Vickers","user_email":"jon.vickers@micajah.com","note":"I am adding a test expense to the system","date":"2013-07-09T00:00:00.0000000","amount":12.0000,"fb_expense_id":0,"ticket_id":17925,"ticket_key":"xshmey","category_id":"","category":"","project_id":71,"account_id":-1,"ticket_number":798,"account_name":"SherpaDesk Support","ticket_subject":"Freshbooks Configuration Refinements Small","invoice_id":0,"billable":true,"invoice_pseudo_id":"      ","vendor":"","fb_staff_id":0,"fb_category_id":0,"fb_client_id":0,"fb_project_id":0,"markup":0,"markup_value":0,"note_internal":"","qb_expense_id":0,"qb_service_id":0,"qb_employee_id":0,"qb_vendor_id":0,"qb_customer_id":0,"qb_sync_token":0,"qb_is_employee":false,"qb_account_id":0,"user_profile_image":"https://secure.gravatar.com/avatar/57f5bc4e7331308ba723d81cbe59927b?d=identicon&r=g&s=40","hidden_from_invoice":false,"is_technician_payment":false,"payment_id":0,"units":1,"contract_id":0,"contract_name":""},{"expense_id":"faf9d799-f2ff-4ee0-9f4d-e0d65b1ba2f1","project_name":"","user_id":"270","user_name":"Eugene Tolmachov","user_email":"eugene@micajah.com","note":"test20150828","date":"2015-08-28T17:34:00.0000000","amount":10.0000,"fb_expense_id":0,"ticket_id":363663,"ticket_key":"3wnt4m","category_id":"","category":"","project_id":0,"account_id":-1,"ticket_number":4307,"account_name":"SherpaDesk Support","ticket_subject":"test","invoice_id":2626,"billable":false,"invoice_pseudo_id":"g5gngk","vendor":"","fb_staff_id":0,"fb_category_id":0,"fb_client_id":0,"fb_project_id":0,"markup":0,"markup_value":0,"note_internal":"","qb_expense_id":0,"qb_service_id":0,"qb_employee_id":0,"qb_vendor_id":0,"qb_customer_id":0,"qb_sync_token":0,"qb_is_employee":false,"qb_account_id":0,"user_profile_image":"https://secure.gravatar.com/avatar/8a3bd35c5518ff857b460afd1ddb629d?d=identicon&r=g&s=40","hidden_from_invoice":false,"is_technician_payment":false,"payment_id":0,"units":1,"contract_id":0,"contract_name":"Main"},{"expense_id":"cd6ce5f2-fda1-4867-b059-2be23d4b65ad","project_name":"Freshbooks Integration v1","user_id":"1","user_name":"Jon Vickers","user_email":"jon.vickers@micajah.com","note":"I am adding a test expense to the system","date":"2013-07-09T00:00:00.0000000","amount":12.0000,"fb_expense_id":0,"ticket_id":17925,"ticket_key":"xshmey","category_id":"","category":"","project_id":71,"account_id":-1,"ticket_number":798,"account_name":"SherpaDesk Support","ticket_subject":"Freshbooks Configuration Refinements Small","invoice_id":0,"billable":true,"invoice_pseudo_id":"      ","vendor":"","fb_staff_id":0,"fb_category_id":0,"fb_client_id":0,"fb_project_id":0,"markup":0,"markup_value":0,"note_internal":"","qb_expense_id":0,"qb_service_id":0,"qb_employee_id":0,"qb_vendor_id":0,"qb_customer_id":0,"qb_sync_token":0,"qb_is_employee":false,"qb_account_id":0,"user_profile_image":"https://secure.gravatar.com/avatar/57f5bc4e7331308ba723d81cbe59927b?d=identicon&r=g&s=40","hidden_from_invoice":false,"is_technician_payment":false,"payment_id":0,"units":1,"contract_id":0,"contract_name":""}]
    this.recipients = [];
    console.log(this.timelogs);
    }


ngOnInit()
{    
    this.UserDateOffset = this.config.getCurrent("timezone_offset");
    this.data = this.navParams.data || {};
    this.pager = { page: 0 };

            this.he = this.config.getCurrent("user");

            let recent : any = {};

            if (!this.data.number && !(this.data.account || {}).id)
            {
                recent = this.config.current.recent || {};
            }

            let account_id = (this.data.account || {}).id || this.data.account_id || (recent.account || {}).selected || this.he.account_id || -1;
            let contract_id = (this.data.contract || {}).id || this.data.contract_id || (recent.contract || {}).selected || 0;
            let project_id = (this.data.project || {}).id || this.data.project_id || (recent.project || {}).selected || 0;
            if(contract_id)
                this.getContract(contract_id);
            if (contract_id && account_id !=0)
                this.getInvoice(account_id, contract_id);


            this.selects = {
                    "user" : {
                    name: "User", 
                    value: getFullName(this.he.firstname, this.he.lastname, this.he.email),
                    selected: this.he.user_id,
                    url: "users",
                    hidden: false
                },
                "recipient_user" : {
                    name: "recipient_user", 
                    value: getFullName(this.he.firstname, this.he.lastname, this.he.email),
                    selected: this.he.user_id,
                    url: "users",
                    hidden: false
                },
                "account" : {
                    name: "Account", 
                    value:  (this.data.account || {}).name || this.data.account_name || (recent.account || {}).value || this.he.account_name,
                    selected: account_id,
                    url: "accounts?is_with_statistics=false",
                    hidden: false,
                    is_disabled: this.data.ticket_number
                },
                "project" : {
                    name: "Project", 
                    value:  this.data.project_name || (recent.project || {}).value || "Default",
                    selected: project_id,
                    url: `projects?account=${account_id}&is_with_statistics=false`,
                    hidden: false,
                    is_disabled: this.data.ticket_number
                },
                "ticket" : {
                    name: "Ticket", 
                    value: this.data.ticket_number ? `#${this.data.ticket_number}: ${this.data.ticket_subject}` : "Choose (optional)",
                    selected: this.data.ticket_number || 0,
                    url: `tickets?status=open&account=${account_id}&project=${project_id}`,
                    hidden: this.data.is_project_log || false,
                    is_disabled: this.data.task_type_id
                },
                 "contract" : { 
                    name: "Contract", 
                    value: this.data.contract_name || (recent.contract || {}).value || "Choose",
                    selected: this.data.contract_id || this.config.getRecent("contract").selected || 0,
                    url: `contracts?account_id=${account_id}`,
                    hidden: false,
                    is_disabled: false,
                    is_once: true
                },
                "prepaidpack" : {
                    name: "PrePaid Pack", 
                    value: this.data.prepaid_pack_name || (recent.prepaidpack || {}).value || "Choose",
                    selected: this.data.prepaid_pack_id || this.config.getRecent("prepaidpack").selected || 0,
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
            this.selects.contract.value = "Choose";
            this.selects.contract.selected = 0;
            contract_id = 0;
            this.selects.prepaidpack.url = `prepaid_packs?contract_id=0`;
            this.selects.prepaidpack.value = "Choose (optional)";
            this.selects.prepaidpack.selected = 0;
            account_id = event.id;
            this.selects.ticket.hidden = this.data.is_project_log || this.data.task_type_id || false;
            if (!this.data.task_type_id){
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
            if (!this.data.task_type_id){
                this.selects.ticket.hidden = this.data.is_project_log || this.data.task_type_id || false;
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

            if (contract_id) 
                   this.getContract(contract_id);
            break;

            case "ticket" :
            if (this.selects.ticket.selected === event.id)
            {
                break;
            }
            ticket_id = event.id;
            break;

            case "recipient_user" :
            if (this.selects.recipient_user.selected === event.id)
            {
                break;
            }
            let new_recipient = {"id": event.id, "email": event.email, "fullname": event.name};
            this.recipients.push(new_recipient);
            break;
        }
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
        if (contract_id && account_id !=0)
            this.getInvoice(account_id, contract_id);
    }
    
    getContract(contract_id){
        this.dataProvider.getContracts(this.pager, contract_id).subscribe(
            data => {
                this.contract = data;
                this.contract.date = new Date().toJSON().substring(0,19);
            },
        );
    }

    addTime()
   {
       this.config.setRecent({"account": this.selects.account,
                              "user": this.selects.user,
                              "project": this.selects.project,
                              "ticket": this.selects.ticket,
                              "contract": this.selects.contract,
                              "prepaidpack": this.selects.prepaidpack});
       console.log("user", this.selects.user,);
     let myModal = Modal.create(TimelogPage);
     myModal.onDismiss(data => {
       if(data){
           this.timelogs.splice(0,0,data);
       console.log(this.timelogs, "timelogs");
     }
       });
       this.nav.present(myModal);
     }

     addExpense()
     {
       this.config.setRecent({"account": this.selects.account,
                              "user": this.selects.user,
                              "project": this.selects.project,
                              "ticket": this.selects.ticket,
                              "contract": this.selects.contract,
                              "prepaidpack": this.selects.prepaidpack});
       let myModal = Modal.create(ExpenseCreatePage);
       myModal.onDismiss(data => {
           if(data){
            data.date= new Date().toJSON().substring(0,19);
            this.expenses.splice(0,0,data);
            console.log(this.expenses);
            }
         });
         this.nav.present(myModal);
       }

       getInvoice(account_id, contract_id){

        this.dataProvider.getInvoice(false, account_id, contract_id).subscribe(
            data => {
                if (data.length == 1)
                    data = data[0];
                console.log(data,"dataInvoice");
                if (data.recipients)
                data.recipients = data.recipients.sort(function(a, b) {
                    return a.is_accounting_contact < b.is_accounting_contact ? 1 : -1;
                });
                this.recipients = data.recipients;
                    },
            error => {
                console.log(error || 'Server error');
            }
        ); 
   }   

    onSubmit() {
        this.config.setRecent({"account": this.selects.account,
                              "user": this.selects.user,
                              "project": this.selects.project,
                              "ticket": this.selects.ticket,
                              "contract": this.selects.contract,
                              "prepaidpack": this.selects.prepaidpack});

 console.log(this.timelogs.length,"timelogs");
         let timelog_ids = "";
         for (var n = 0;  n < this.timelogs.length; n++) 
            timelog_ids += this.timelogs[n].time_id + ", ";
         
         let expense_ids = "";
         for (var n = 0;  n < this.expenses.length; n++) 
            expense_ids += this.expenses[n].expense_id + ", ";
         
         let recipient_ids = "";
         for (var n = 0;  n < this.recipients.length; n++) 
            recipient_ids += this.recipients[n].id + ", ";
        timelog_ids = timelog_ids.slice(0,-2);
        expense_ids = expense_ids.slice(0,-2);
        recipient_ids = recipient_ids.slice(0,-2);

            let data = {
                "project_id": this.selects.project.selected,
                "is_project_log": !this.selects.ticket.selected,
                "ticket_key": this.selects.ticket.selected,
                "account_id": this.selects.account.selected,
                "prepaid_pack_id" : this.selects.prepaidpack.selected,
                "contract_id": this.selects.contract.selected,
                "is_local_time": true,
                "timelog_ids": timelog_ids,
                "expense_ids": expense_ids,
                "recipient_ids": recipient_ids

            };
            console.log(data,"data");
    }

    changeContact(recipient) {
        recipient.is_accounting_contact = !recipient.is_accounting_contact;
    }

    setDate(date, showmonth?, istime?) {
        return date ? getDateTime(date, showmonth, istime) : null;
    }


    getFixed(value) {
        return Number(value || "0").toFixed(2).toString();
    }
    
    getCurrency(value) {
        return getCurrency(value);
    }

// show invoice ?
    viewInvoice() {
        let invoice = {
            account_name : this.data.account_name,
            id: this.data.invoice_id,
            account_id: this.data.account_id,
            project_id: this.data.project_id
        };

        this.nav.push(InvoiceDetailsPage, invoice);
    }
}
