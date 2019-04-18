import {Page, Config, Nav, NavParams, ViewController, Modal} from 'ionic-angular';
import {forwardRef, ViewChild} from '@angular/core';
import {FORM_DIRECTIVES, Validators} from '@angular/common';
import {TicketProvider} from '../../../providers/providers';
import {htmlEscape, getFullName} from '../../../directives/helpers';
import {DataProvider} from '../../../providers/data-provider';
import {ClassListComponent} from '../../../components/class-list/class-list';
import {LocationListComponent} from '../../../components/location-list/location-list';
import {SelectListComponent} from '../../../components/select-list/select-list';
import {UploadButtonComponent} from '../../../pages/ticket-details/ticket-details';
import {CustomFieldComponent} from '../../../components/custom-field/custom-field';

@Page({
    templateUrl: 'build/pages/modals/ticket-create/ticket-create.html',
    directives: [forwardRef(() => ClassListComponent), forwardRef(() => LocationListComponent), forwardRef(() => CustomFieldComponent), forwardRef(() => SelectListComponent), UploadButtonComponent],
})
export class TicketCreatePage {

    @ViewChild(UploadButtonComponent) private uploadComponent: UploadButtonComponent;
    data: any;
    ticket: any;
    account_id: any;
    contractors: number;
    he: any;
    selects: any;
    fileDest: any = {ticket: "11"};
    files: any = [];
    customfields: any = [];
    pager: any;
    profile: any = {};

    constructor(private nav: Nav, private navParams: NavParams, private ticketProvider: TicketProvider, private config: Config,
                 private viewCtrl: ViewController, private dataProvider: DataProvider) {
        nav.swipeBackEnabled = false;
    }

    ngOnInit()
    {
        //for test only
        //console.log(this.config.current.is_require_ticket_initial_post);
        //this.config.current.is_budget_time = true;

        this.he = this.config.getCurrent("user");

        this.data = this.navParams.data || {};

        this.getProfile();

        let recent : any = {};
        if (!this.data.account)
        {
                recent = this.config.current.recent || {};
        }

        this.account_id = this.profile.account_id ||(this.data.account || {}).id || (recent.account || {}).selected || this.he.account_id || -1;
        let location_id = this.profile.location_id || (this.data.location || {}).id || (recent.location || {}).selected || 0;
        let contract_id = recent.default_contract_id || 0;

        this.selects = {
            "user" : {
                name: "User", 
                value: getFullName(this.he.firstname, this.he.lastname, this.he.email),
                selected: this.he.user_id,
                url: "users",
                hidden: false
            },
            "location" : {
                name: "Location", 
                value: this.profile.location_name || (this.data.location || {}).name || (recent.location || {}).value || "Default",
                selected: location_id,
                url: `locations?account=${this.account_id}&limit=1000`,
                hidden: false
            },
            "project" : {
                name: "Project", 
                value: (recent.project || {}).value || "Default",
                selected: (recent.project || {}).selected || 0,
                url: `projects?account=${this.account_id}&is_with_statistics=false`,
                hidden: false
            },
            "submissions" : {
                name: "Submission Category", 
                value: (recent.submissions || {}).value || "Choose",
                selected: (recent.submissions || {}).value || 0,
                url: `submissions`,
                hidden: !this.config.current.is_submission_category
            },
            "categories" : {
                name: "Creation Category", 
                value: (recent.categories || {}).value || "Default",
                selected: (recent.categories || {}).selected || 0,
                url: `categories`,
                hidden: !this.config.current.is_creation_categories
            },
            "contract" : { 
                    name: "Contract", 
                    value: recent.default_contract_name || "Choose",
                    selected: recent.default_contract_id || this.config.getRecent("contract").selected || 0,
                    url: `contracts?account_id=${this.account_id}`,
                    hidden: false    
                },
            "class" : {
                name: "Class", 
                value: (recent.class || {}).value || "Choose",
                selected: (recent.class || {}).selected || 0,
                url: "classes",
                hidden: false
            },
            "priority" : {
                name: "Priority", 
                value: (recent.priority || {}).value || "Default",
                selected: (recent.priority || {}).selected || 0,
                url: "priorities",
                hidden: false
            },
            "level": {
                 name: "Level",
                 value: "Default",
                 selected: 0,
                 url: "levels",
                 hidden: !this.config.current.is_tech_choose_levels && !this.config.current.user.is_admin
           }
        };

        if(this.selects.class.selected > 0)
            this.getCustomfield(recent.class.selected);

        this.selects.tech = {
            name: "Tech", 
            value: (this.data.tech || {}).name || "Choose",
            selected: (this.data.tech || {}).id || 0,
            url: this.config.current.is_allow_user_choose_tech && this.config.current.is_allow_user_choose_queue_only ? "users?role=queue" : "technicians",
            hidden: false
        };
 
        this.selects.account = {
            name: "Account", 
            value: this.profile.account_name || (this.data.account || {}).name || (recent.account || {}).value || this.he.account_name,
            selected: this.account_id,
            url: "accounts?is_with_statistics=false&limit=500",
            hidden: false
        };

        this.ticket =
            {
            "subject" : "",
            "initial_post" : "",
            "class_id" : null,
            "account_id" : this.account_id,
            "location_id": location_id,
            "user_id" : this.he.user_id,
            "tech_id" : 0,
            "default_contract_id": contract_id,
            "priority_id" : 0,
            "estimated_time": 0,
        };

        this.ticket.estimated_time = this.getFixed(this.ticket.estimated_time);

            this.getCustomfield(contract_id);
    }

    dismissPage(data) {
        if (data)
            this.nav.alert(this.config.current.names.ticket.s + ' was Succesfully Created :)');
        //data.is_add_Time on Ticket Creation = true
        this.viewCtrl.dismiss(data);
    }

    saveSelect(event){
        let name = event.type;
        if (name == "creationcategory")
            name = "categories";
        if (name == "submissioncategory")
            name = "submissions";
        let contract_id = this.selects.contract.selected;
        //change url on related lists
        switch (name) {
            case "user" :
                this.selects.user.value = event.name;
                this.selects.user.selected = event.id;
                this.getProfile(event.id);
                break;
            case "account" :
                this.getProfile(this.selects.user.selected, event.id);
                this.selects.project.url = `projects?account=${event.id}&is_with_statistics=false`;
                this.selects.project.value = "Default";
                this.selects.project.selected = 0;
                
                this.account_id = event.id;
                this.selects.tech.items.splice(0,this.contractors);
                this.getContractor(this.account_id);

                this.selects.contract.url = `contracts?account_id=${event.id}`;
                this.selects.contract.value = "Default";
                this.selects.contract.selected = 0;
                contract_id = 0;
                break;
            case "class" :
                this.selects.class.value = event.name;
                this.selects.class.selected = event.id;
                if (this.ticket.class_id == event.id)
                    break;
            
              this.getCustomfield(event.id);
              break;
            default:
                    this.selects[name].selected = event.id;
                    this.selects[name].value = event.name || "Default";
        break;
        }
    }

    getContractor(account_id)
   {
     this.ticketProvider.getContractor(account_id).subscribe(
       data => {
         this.contractors=data.length;
         if (data){
             data.forEach(item => {
                 item.lastname = "Contractor: " + item.lastname;
                 this.selects.tech.items.splice(0,0,item);
             });
         }
       },
       error => {
         console.log(error || 'Server error');
       }
       );
   }

    getProfile(id?, account?){
            this.dataProvider.getProfile(id, account).subscribe(
            data => {
                this.profile = data;
                if (id && !account) {
                this.selects.account.value = this.profile.account_name || this.he.account_name;
                this.selects.account.selected = this.profile.account_id || -1;
                this.getProfile(id, this.selects.account.selected);
                }

                this.selects.location.url = `locations?account=${this.selects.account.selected || -1}&limit=500`;
                this.selects.location.value = this.profile.location_name || "Default";
                this.selects.location.selected = this.profile.location_id || 0;
                   }, 
            error => { 
                console.log(error || 'Server error');}
        ); 
        }

    saveCustomfield(event){
     this.customfields.filter(tc => tc.id == event.id)[0].value = event.value;
   }

   getXML()
   {
      var customfield_xml = "";
          for (var n = 0;  n < this.customfields.length; n++)
         { 
           if (this.customfields[n].required && this.customfields[n].value == "" || this.customfields[n].value == "0001-01-01T00:00:00.0000000"){
             this.nav.alert(`Please add value to custom field: ${this.customfields[n].name}`, true);
             return customfield_xml = "";
           }
           customfield_xml = customfield_xml + `<field id="${this.customfields[n].id}"><caption>${this.customfields[n].name}</caption><value>${this.customfields[n].value}</value></field>`;
         }
      return "<root>" + customfield_xml + "</root>";  

   }

   uploadedFile(event)
   {
     //if (event.indexOf("ok") == 0)
     //{
        this.dismissPage(this.ticket);
     //}
   }

   selectedFile(event)
   {
     this.files = event;
     this.ticket.initial_post = this.ticket.initial_post.trim(); 
     if (event.length && !this.ticket.initial_post)
     {
       this.ticket.initial_post = "  ";
     }
   }

   getCustomfield(class_id)
   {
       if (class_id == 0)
           return this.customfields = [];
     this.ticketProvider.getCustomfields(class_id, this.pager).subscribe(
       data => {
           this.customfields = data;
       },
       error => {
         console.log(error || 'Server error');
       }
       );
   }

    onSubmit(form) {
        /*if (!this.selects.tech.id)
            {
                this.nav.alert('Please select technician...', true);
                return;
            }
            */
        if (form.valid){
            //proof double click
            if (this.ticket.in_progress && Date.now() - this.ticket.in_progress < 1500) {return;}
            this.ticket.in_progress = Date.now();
            if (this.config.current.is_budget_time)
                this.ticket.estimated_time = isNaN(form.value.budgeted_time) ? 0 : Number(form.value.budgeted_time);
           
            this.ticket.subject = htmlEscape(this.ticket.subject.trim());          
            this.ticket.initial_post = htmlEscape(this.ticket.initial_post.trim()).substr(0, 4500);
            if (this.config.current.is_require_ticket_initial_post && !this.ticket.initial_post.length)
            {
                this.nav.alert("Note is required!",true);
                return;
            }
            if (this.config.current.is_submission_category && !this.selects.submissions.selected)
            {
                this.nav.alert("Please choose Submission Category",true);
                return;
            }
            if (this.config.current.is_creation_categories && this.config.current.is_creation_categories_required_on_creation && !this.selects.categories.selected)
            {
                this.nav.alert("Please choose Creation Category",true);
                return;
            }

            if (this.files.length)
            {
                this.ticket.initial_post += "\n\nFollowing file" + (this.files.length > 1 ? "s were" : " was") + " uploaded: " + this.files.join(", ") +".";
            }
            var customfields_xml = this.getXML();
             if (customfields_xml == "") 
               return;
            

            this.ticket.class_id = this.selects.class.selected;
            this.ticket.account_id = this.selects.account.selected;
            this.ticket.location_id = this.selects.location.selected;
            this.ticket.user_id = this.he.is_techoradmin ? this.selects.user.selected : this.he.user_id;
            this.ticket.tech_id = this.selects.tech.selected;
            this.ticket.priority_id = this.selects.priority.selected;
            this.ticket.level = this.selects.level.selected;
            this.ticket.customfields_xml = customfields_xml;
            this.ticket.default_contract_id = this.selects.contract.selected;
            this.ticket.default_contract_name = this.selects.contract.value;
            this.ticket.creation_category_id = this.selects.categories.selected;
            this.ticket.creation_category_name = this.selects.categories.value;
            this.ticket.submission_category = this.selects.submissions.value;
            

            this.ticketProvider.addTicket(this.ticket).subscribe(
                data => {
                    if (!this.data.account)
            {
                this.config.setRecent({"account": this.selects.account,
                                       "location": this.selects.location,
                                               "project": this.selects.project,
                                               "class": this.selects.class,
                                               "default_contract_id": this.selects.contract.selected,
                                               "default_contract_name": this.selects.contract.value,
                                               "categories": this.selects.categories,
                                               "submissions": this.selects.submissions,
                                               "priority": this.selects.priority});
            }
                    if (this.files.length)
                    {
                       this.ticket = data; 
                       this.fileDest.ticket = data.key;
                       this.uploadComponent.onUpload();
                    }
                    else 
                        this.dismissPage(data);
                }, 
                error => { 
                    this.nav.alert(this.he.is_techoradmin ? ("Please select " + this.config.current.names.tech.s) : error, true);
                    console.log(error || 'Server error');}
            );
        }
    }

    getFixed(value){
        return Number(value || "0").toFixed(2);
    }
}

