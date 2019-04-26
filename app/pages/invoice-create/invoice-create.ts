import {Page, Config, Nav, NavParams, Modal, ViewController, Loading} from 'ionic-angular';
import {forwardRef, ViewChild} from '@angular/core';
import {getDateTime, getPickerDateTimeFormat, htmlEscape, getFullName, linebreaks, getCurrency} from '../../directives/helpers';
import {TimeProvider} from '../../providers/time-provider';
import {DataProvider} from '../../providers/data-provider';
import {ApiData} from '../../providers/api-data';
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
    account_id: any;
    invoice_start_date: any;
    invoice_end_date: any;
    total_cost: any;
    total_hours: any;
    exspense_total: any;
    pager: any = [];
    expenses: any = [];
    recipients: any = [];
    localrecipients: any = [];
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
    in_progress: any;

    constructor(private nav: Nav, private navParams: NavParams, private apiData: ApiData, private dataProvider: DataProvider, private timeProvider: TimeProvider, private config: Config, private view: ViewController) {
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

            this.account_id = (this.data.account || {}).id || this.data.account_id || (recent.account || {}).selected || this.he.account_id || -1;
            let contract_id = (this.data.contract || {}).id || this.data.contract_id || (recent.contract || {}).selected || 0;
            let project_id = (this.data.project || {}).id || this.data.project_id || (recent.project || {}).selected || 0;
            if(contract_id)
                this.getContractInfo(contract_id);
            if (contract_id && this.account_id !=0)
                this.getInvoice(this.account_id, contract_id);


            this.selects = {
                    "user" : {
                    name: "User", 
                    value: getFullName(this.he.firstname, this.he.lastname, this.he.email),
                    selected: this.he.user_id,
                    url: "users",
                    hidden: false,
                    //is_once: true
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
                    selected: this.account_id,
                    url: "accounts?is_with_statistics=false&limit=500",
                    hidden: false,
                    //is_once: true,
                    is_disabled: this.data.ticket_number
                },
                "project" : {
                    name: "Project", 
                    value:  this.data.project_name || (recent.project || {}).value || "Default",
                    selected: project_id,
                    url: `projects?account=${this.account_id}&is_with_statistics=false`,
                    hidden: false,
                    is_disabled: this.data.ticket_number,
                    //is_once: true
                },
                "ticket" : {
                    name: "Ticket", 
                    value: this.data.ticket_number ? `#${this.data.ticket_number}: ${this.data.ticket_subject}` : "Choose (optional)",
                    selected: this.data.ticket_number || 0,
                    url: `tickets?status=open&account=${this.account_id}&project=${project_id}`,
                    hidden: this.data.is_project_log || false,
                    is_disabled: this.data.task_type_id,
                    //is_once: true
                },
                 "contract" : { 
                    name: "Contract", 
                    value: this.data.contract_name || (recent.contract || {}).value || "Choose",
                    selected: this.data.contract_id || this.config.getRecent("contract").selected || 0,
                    url: `contracts?account_id=${this.account_id}`,
                    hidden: false,
                    //is_disabled: false,
                    //is_once: true
                },
                "prepaidpack" : {
                    name: "PrePaid Pack", 
                    value: this.data.prepaid_pack_name || (recent.prepaidpack || {}).value || "Choose",
                    selected: this.data.prepaid_pack_id || this.config.getRecent("prepaidpack").selected || 0,
                    url: `prepaid_packs?contract_id=${contract_id}`,
                    hidden: false,
                    //is_once: true
                }
            };
        }

        saveSelect(event){
            let name = event.type;
            this.account_id = this.selects.account.selected;
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
            this.timelogs = [];
            this.expenses = [];
            this.recipients = [];
            this.total_hours = false;
            this.exspense_total = false;
            this.total_cost = false;
            this.selects.prepaidpack.url = `prepaid_packs?contract_id=0`;
            this.selects.prepaidpack.value = "Choose (optional)";
            this.selects.prepaidpack.selected = 0;
            this.account_id = event.id;
            this.selects.ticket.hidden = this.data.is_project_log || this.data.task_type_id || false;
            if (!this.data.task_type_id){
                this.selects.ticket.url = `tickets?status=open&account=${this.account_id}&project=${project_id}`,
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
                this.selects.ticket.url = `tickets?status=open&account=${this.account_id}&project=${event.id}`,
                this.selects.ticket.value = "Choose (optional)";
                this.selects.ticket.selected = 0;
            }
            project_id = event.id;
            break;
            case "contract" :
            if (event.id){
                    //this.getContractInfo(event.id);
                    //this.selects.account.is_disabled = true;
                    //this.selects.project.is_disabled = true;
                    //this.selects.prepaidpack.is_disabled = true;
                }
            else
                {
                this.nav.alert("Cannot create any invoice. Please add or select Contract to "+this.selects.account.value, true);
            return;
            }
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
            this.getInvoice(this.account_id, contract_id);
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
            let new_recipient = {"id": event.id, "email": event.email, "fullname": event.name, "is_accounting_contact" : true};
            this.localrecipients.push(new_recipient);
            this.recipients.push(new_recipient);
            break;
        }
        this.selects[name].selected = event.id;
        if (event.id > 0 )
            this.selects[name].value = event.name || "Default";
    }
    
    getContractInfo(contract_id){
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
       if (!this.selects.contract.selected){
           this.nav.alert("Please choose Contract", true);
           return;
       }
       
     let myModal = Modal.create(TimelogPage, {is_fixed: true});
     myModal.onDismiss(data => {
       if(data){
       //ß    this.timelogs.splice(0,0,data);
           this.getInvoice(this.selects.account.selected, this.selects.contract.selected);
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
        if (!this.selects.contract.selected){
           this.nav.alert("Please choose Contract", true);
           return;
        }
       let myModal = Modal.create(ExpenseCreatePage, {is_fixed: true});
       myModal.onDismiss(data => {
           if(data){
           // data.date= new Date().toJSON().substring(0,19);
           // this.expenses.splice(0,0,data);
            this.getInvoice(this.selects.account.selected, this.selects.contract.selected);
            }
         });
         this.nav.present(myModal);
       }

       getInvoice(account_id, contract_id){
           let start_date = new Date().toJSON().substring(0,19);
           let end_date = new Date().toJSON().substring(0,19);
           let loading = Loading.create({
                     content: "Refreshing...",
                     duration: 1000,
                     dismissOnPageChange: true
                 });
                 this.nav.present(loading);
        this.dataProvider.getInvoice(false, account_id, contract_id, start_date, end_date, true).subscribe(
            data => {
                loading.dismiss();
                if (data.length == 1)
                    data = data[0];
                data.recipients = data.recipients || [];
                data.recipients = data.recipients.sort(function(a, b) {
                    return a.is_accounting_contact < b.is_accounting_contact ? 1 : -1;
                });
                this.recipients = [];
                this.recipients.push(...this.localrecipients);
                this.recipients.push(...data.recipients);
                this.invoice_start_date = new Date().toJSON().substring(0,19);
                this.invoice_end_date = new Date().toJSON().substring(0,19);
                this.total_cost = data.total_cost;
                this.total_hours = data.total_hours;
                this.exspense_total = data.misc_cost;
                this.timelogs = data.time_logs;
                this.expenses = data.expenses;
                    },
            error => {
                loading.dismiss();
                console.log(error || 'Server error');
            }
        ); 
   }   

   onSubmit() {
        if (!this.total_cost) {
            this.nav.alert("Total cost is 0. Please add time or expenses!", true);
            return;
        }

        if (!this.recipients.filter(v => v.is_accounting_contact).length) {
            this.nav.alert("No accounting contacts selected", true);
            return;
        }
        //proof double click
            if (this.in_progress && Date.now() - this.in_progress < 1500) {return;}
            this.in_progress = Date.now();
            
        var emails = "";
        this.recipients.forEach((v) => {
            if (v.is_accounting_contact) { emails += v.email + ","; }
        });

        this.config.setRecent({"account": this.selects.account,
                              "user": this.selects.user,
                              "project": this.selects.project,
                              "ticket": this.selects.ticket,
                              "contract": this.selects.contract,
                              "prepaidpack": this.selects.prepaidpack});

        let data: any = {};

            data.status = "unbilled";
            data.account = this.selects.account.selected;
            data.contract_id = this.selects.contract.selected;
            data.start_date = (new Date).toJSON();
            data.end_date = (new Date).toJSON();
            data.recipients = emails;

        this.apiData.get('invoices/', data, 'POST').subscribe(
                data => {
                    this.nav.alert('Hurray! Invoice sent :)');
                    this.nav.pop();
                },
                error => {
                    this.nav.alert(error, true);
                    console.log(error || 'Server error');
                }
            );
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
    close() {
        this.view.dismiss();
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
