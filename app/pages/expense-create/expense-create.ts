import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {getDateTime, htmlEscape, linebreaks, getFullName} from '../../directives/helpers';
import {ApiData} from '../../providers/api-data';
import {ClassListComponent} from '../../components/class-list/class-list';
import {SelectListComponent} from '../../components/select-list/select-list';

@Page({
    templateUrl: 'build/pages/expense-create/expense-create.html',
    directives: [forwardRef(() => ClassListComponent), forwardRef(() => SelectListComponent)],
})
export class ExpenseCreatePage {

    expense: any = {};
    isbillable: boolean;
    is_technician_payment: boolean;
    he: any;
    selects: any;
    title: string;
    account_id: any;

    constructor(private nav: Nav, private navParams: NavParams, private apiData: ApiData, private config: Config, private view: ViewController) {
    }
    
    ngOnInit()
    {
        this.expense = this.navParams.data || {};

        let name = (this.expense.user_name + " " + this.expense.user_email).trim().split(' ')[0];
        if (this.expense.expense_id){
            this.title = `Expense by ${name} on\u00a0` + this.setDate(this.expense.date, false, true);
            this.expense.note = linebreaks(this.expense.note, true);
            this.expense.note_internal = linebreaks(this.expense.note_internal, true);
        }
        else if (this.expense.number)
            this.title = `Add Expense to\u00a0#${this.expense.number} ${this.expense.subject}`;
        else
            this.title = "Create Expense";
        if(this.expense.amount)
        this.expense.amount = this.getFixed(this.expense.amount);
        this.expense.units = (typeof this.expense.units === 'undefined' || this.expense.units === 0) ? 1 : this.expense.units;
        this.expense.markup_value = (typeof this.expense.markup_value === 'undefined' || this.expense.markup_value <= 0) ? "" : this.getFixed(this.expense.markup_value);

        this.isbillable = typeof this.expense.billable === 'undefined' ? true : this.expense.billable;
        this.is_technician_payment = typeof this.expense.is_technician_payment === 'undefined' ? true : this.expense.is_technician_payment;
        
        this.he = this.config.getCurrent("user");

        let recent : any = {};

            if (!this.expense.number && !this.expense.expense_id && !this.expense.account)
            {
                recent = this.config.current.recent || {};
            }

        this.account_id = (this.expense.account || {}).id || this.expense.account_id || (recent.account || {}).selected || this.he.account_id || -1;
        let project_id = (this.expense.project || {}).id || this.expense.project_id || (recent.project || {}).selected || 0;
        let contract_id = (this.expense.contract || {}).id || this.expense.contract_id || (recent.contract || {}).selected || 0;
        let category_id = (this.expense.category || {}).id || this.expense.category_id || (recent.category || {}).selected || 0;

        this.selects = {
            "account": {
                name: "Account",
                value: this.expense.account_name || (this.expense.account || {}).name || (recent.account || {}).value || this.he.account_name,
                selected: this.account_id,
                url: "accounts?is_with_statistics=false&limit=500",
                hidden: this.expense.is_fixed
            },
            "ticket" : {
                    name: "Ticket", 
                    value: this.expense.ticket_number ? `#${this.expense.ticket_number}: ${this.expense.ticket_subject}` : "Choose (optional)",
                    selected: this.expense.ticket_number || 0,
                    url: `tickets?status=open&account=${this.account_id}&project=${project_id}`,
                    hidden: this.expense.project_id || this.expense.is_fixed || false,
                    is_disabled: this.expense.ticket_id,
                },
            "project": {
                name: "Project",
                value: this.expense.project_name || (recent.project || {}).value || "Default",
                selected: project_id,
                url: `projects?account=${this.account_id}&is_with_statistics=false`,
                hidden: this.expense.is_fixed || this.expense.ticket_id
                },
            "contract" : { 
                    name: "Contract", 
                    value: this.expense.contract_name || (recent.contract || {}).value || "Choose",
                    selected: this.expense.contract_id || this.config.getRecent("contract").selected || 0,
                    url: `contracts?account_id=${this.account_id}&for_time_logs=false`,
                    hidden: this.expense.is_fixed,
                    is_disabled: false,
                },
            "category" : { 
                    name: "Category", 
                    value: this.expense.category_name || (recent.category || {}).value || "Choose",
                    selected: this.expense.category_id || this.config.getRecent("category").selected || null,
                    url: `expenses/categories`,
                    is_disabled: false,
                },
        };      
    }
    
    saveSelect(event) {
        let name = event.type;
        this.account_id = this.selects.account.selected;
        let ticket_id = this.selects.ticket.selected;
        let project_id = this.selects.project.selected;
        let contract_id = this.selects.contract.selected;
        //change url on related lists
        switch (name) {
            case "account":
            if (this.selects.account.selected === event.id) {
                break;
            }
            this.selects.project.url = `projects?account=${event.id}&is_with_statistics=false`;
            this.selects.project.value = "Default";
            this.selects.project.selected = 0;
            this.account_id = event.id;
            this.selects.project.hidden = false;
            this.selects.contract.url = `contracts?account_id=${event.id}&for_time_logs=false`;
            this.selects.contract.value = "Choose";
            this.selects.contract.selected = 0;
            contract_id = 0;
            break;
            case "project" :
            if (this.selects.project.selected === event.id)
            {
                break;
            }
            // dont change ticket on edit
            if (!this.expense.ticket_id){
                this.selects.ticket.url = `tickets?status=open&account=${this.account_id}&project=${event.id}`,
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
            contract_id = event.id;
            break;

            case "ticket" :
            if (this.selects.ticket.selected === event.id)
            {
                break;
            }
            ticket_id = event.id;
            this.selects.ticket.value = event.name;
            this.selects.ticket.selected = event.id;
            break;
            default:
            this.selects[name].selected = event.id;
            this.selects[name].value = event.name;
            break;
        }
    }

    onSubmit(form) {
        if (form.valid) {
            //proof double click
            if (this.expense.in_progress && Date.now() - this.expense.in_progress < 1500) {return;}
            this.expense.in_progress = Date.now();
            let amount = isNaN(form.value.amount) ? 0 : Number(form.value.amount);
            if (amount == 0) {
                this.nav.alert("Not enough amount", true);
                return;
            }
            let units = isNaN(form.value.units) ? 0 : Number(form.value.units);
            if (units <= 0) {
                this.nav.alert("Not enough units", true);
                return;
            }
            let markup_value = (!form.value.markup_value || isNaN(form.value.markup_value)) ? -1 : Number(form.value.markup_value);

            var note = htmlEscape(this.expense.note.trim()).substr(0, 5000);

            //TODO if other user changes what id should I write? 
            let exsData = {
                "ticket_key": this.selects.ticket.selected || null,
                "ticket_name": this.selects.ticket.value || null,
                "account_id": this.selects.account.selected,
                "contract_id": this.selects.contract.selected,
                "category_id": this.selects.category.selected,
                "project_id": !this.expense.ticket_number ? this.selects.project.selected : null,
                "project_name": this.selects.project.value,
                "tech_id": !!this.expense.expense_id ? this.expense.user_id : this.he.user_id,
                "user_name": getFullName(this.he.firstname, this.he.lastname, this.he.email),
                "note": this.expense.note,
                "note_internal": this.expense.note_internal,
                "amount": amount,
                "is_billable": this.isbillable,
                "is_technician_payment": this.is_technician_payment,
                "vendor": this.expense.vendor,
                "units": this.expense.units,
                "markup_value": markup_value,
                "expense_id": this.expense.expense_id || ""
            };

            this.apiData.get("expenses", exsData, "POST").subscribe(
                data => {
                    if (!this.expense.number && !this.expense.expense_id && !this.expense.account)
            {
                this.config.setRecent({"account": this.selects.account,
                                       "project": this.selects.project,
                                       "ticket": this.selects.ticket,
                                       "contract": this.selects.contract});
            }

                    this.nav.alert('Expense was successfully added :)');
                    setTimeout(() => this.close(exsData), 500);
                },
                error => {
                    console.log(error || 'Server error');
                }
                );
        }
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
        return Number(value || "0").toFixed(2).toString();
    }
    
    close(data) {
        this.view.dismiss(data);
    }
}

