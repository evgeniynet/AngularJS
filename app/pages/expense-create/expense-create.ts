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

    expense: any;
    isbillable: boolean;
    he: any;
    selects: any;
    title: string;

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

        this.expense.amount = this.getFixed(this.expense.amount);

        this.isbillable = typeof this.expense.billable === 'undefined' ? true : this.expense.billable;
        
        this.he = this.config.getCurrent("user");

        let recent : any = {};

            if (!this.expense.number && !this.expense.expense_id && !this.expense.account)
            {
                recent = this.config.current.recent || {};
            }

        let account_id = (this.expense.account || {}).id || this.expense.account_id || (recent.account || {}).selected || this.he.account_id || -1;
        let project_id = (this.expense.project || {}).id || this.expense.project_id || (recent.project || {}).selected || 0;
        let contract_id = (this.expense.contract || {}).id || this.expense.contract_id || (recent.contract || {}).selected || 0;

        this.selects = {
            "account": {
                name: "Account",
                value: this.expense.account_name || (this.expense.account || {}).name || (recent.account || {}).value || this.he.account_name,
                selected: account_id,
                url: "accounts?is_with_statistics=false",
                hidden: false
            },
            "ticket" : {
                    name: "Ticket", 
                    value: this.expense.ticket_number ? `#${this.expense.ticket_number}: ${this.expense.ticket_subject}` : "Choose (optional)",
                    selected: this.expense.ticket_number || 0,
                    url: `tickets?status=open&account=${account_id}&project=${project_id}`,
                    hidden: this.expense.is_project_log || false,
                    is_disabled: this.expense.task_type_id,
                },
            "contract" : { 
                    name: "Contract", 
                    value: this.expense.contract_name || (recent.contract || {}).value || "Choose",
                    selected: this.expense.contract_id || this.config.getRecent("contract").selected || 0,
                    url: `contracts?account_id=${account_id}`,
                    hidden: false,
                    is_disabled: false,
                },
            "project": {
                name: "Project",
                value: this.expense.project_name || (recent.project || {}).value || "Default",
                selected: project_id,
                url: `projects?account=${account_id}&is_with_statistics=false`,
                hidden: false
            },
        };      
    }
    
    saveSelect(event) {
        let name = event.type;
        let account_id = this.selects.account.selected;
        let ticket_id = this.selects.ticket.selected;
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
            account_id = event.id;
            this.selects.project.hidden = false;
            this.selects.contract.url = `contracts?account_id=${event.id}`;
            this.selects.contract.value = "Choose";
            this.selects.contract.selected = 0;
            contract_id = 0;
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
            break;
        }
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
    }

    onSubmit(form) {
        if (form.valid) {
            //proof double click
            if (this.expense.in_progress && Date.now() - this.expense.in_progress < 1500) {return;}
            this.expense.in_progress = Date.now();
            let amount = isNaN(form.value.amount) ? 0 : Number(form.value.amount);
            if (amount <= 0) {
                this.nav.alert("Not enough amount", true);
                return;
            }
            var note = htmlEscape(this.expense.note.trim()).substr(0, 5000);
            var isEdit = !!this.expense.expense_id;
            //TODO if other user changes what id should I write? 
            let exsData = {
                "ticket_key": this.selects.ticket.selected || null,
                "ticket_name": this.selects.ticket.value || null,
                "account_id": this.selects.account.selected,
                "contract_id": this.selects.contract.selected,
                "project_id": !this.expense.ticket_number ? this.selects.project.selected : null,
                "project_name": this.selects.project.value,
                "tech_id": isEdit? this.expense.user_id : this.he.user_id,
                "user_name": getFullName(this.he.firstname, this.he.lastname, this.he.email),
                "note": this.expense.note,
                "note_internal": this.expense.note_internal,
                "amount": amount,
                "is_billable": this.isbillable,
                "vendor": this.expense.vendor
            };
            console.log(exsData,"data");

            //console.log(data);

            this.apiData.get("expenses" + (!isEdit ? "" : ("/" + this.expense.expense_id)), exsData, isEdit ? "PUT" : "POST").subscribe(
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
        var time_offset = this.config.getCurrent("timezone_offset");     
        date = new Date(date.substring(0,23)+"Z");
        date = new Date(date.setTime(date.getTime() + time_offset*60*60*1000)).toJSON();
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

