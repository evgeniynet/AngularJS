import {Page, Config, Nav, NavParams, ViewController, Modal} from 'ionic-angular';
import {forwardRef, ViewChild} from '@angular/core';
import {FORM_DIRECTIVES, Validators} from '@angular/common';
import {TicketProvider} from '../../../providers/providers';
import {htmlEscape, getFullName} from '../../../directives/helpers';
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
    he: any;
    selects: any;
    fileDest: any = {ticket: "11"};
    files: any = [];
    customfields: any = [];
    pager: any;

    constructor(private nav: Nav, private navParams: NavParams, private ticketProvider: TicketProvider, private config: Config,
                 private viewCtrl: ViewController) {
        nav.swipeBackEnabled = false;
    }

    ngOnInit()
    {
        this.he = this.config.getCurrent("user");

        this.data = this.navParams.data || {};

        let recent : any = {};

        if (!this.data.account)
            {
                recent = this.config.current.recent || {};
            }

        let account_id = (this.data.account || {}).id || (recent.account || {}).selected || this.he.account_id || -1;
        let location_id = (this.data.location || {}).id || (recent.location || {}).selected || 0;
        let contract_id = (this.data.contract || {}).id || this.data.contract_id || (recent.contract || {}).selected || 0;

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
                value: (this.data.location || {}).name || (recent.location || {}).value || "Default",
                selected: location_id,
                url: `locations?account=${account_id}&limit=500`,
                hidden: false
            },
            "project" : {
                name: "Project", 
                value: (recent.project || {}).value || "Default",
                selected: (recent.project || {}).selected || 0,
                url: `projects?account=${account_id}&is_with_statistics=false`,
                hidden: false
            },
            "contract" : { 
                    name: "Contract", 
                    value: (recent.contract || {}).value || "Choose",
                    selected: this.data.contract_id || this.config.getRecent("contract").selected || 0,
                    url: `contracts?account_id=${account_id}`,
                    hidden: false    
                },
            "class" : {
                name: "Class", 
                value: (recent.class || {}).value || "Default",
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

        this.selects.tech = {
            name: "Tech", 
            value: (this.data.tech || {}).name || "Default",
            selected: (this.data.tech || {}).id || 0,
            url: "technicians",
            hidden: false
        };

        this.selects.account = {
            name: "Account", 
            value: (this.data.account || {}).name || (recent.account || {}).value || this.he.account_name,
            selected: account_id,
            url: "accounts?is_with_statistics=false",
            hidden: false
        };

        this.ticket =
            {
            "subject" : "",
            "initial_post" : "",
            "class_id" : null,
            "account_id" : account_id,
            "location_id": location_id,
            "user_id" : this.he.user_id,
            "tech_id" : 0,
            "contract_id": contract_id,
            "priority_id" : 0,
        };
            this.getCustomfield(contract_id);
    }

    dismissPage(data) {
        if (data)
            this.nav.alert(this.config.current.names.ticket.s + ' was Succesfully Created :)');
        this.viewCtrl.dismiss(data);
    }

    saveSelect(event){
        let name = event.type;
        let contract_id = this.selects.contract.selected;
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
        //change url on related lists
        switch (name) {
            case "account" :
                this.selects.project.url = `projects?account=${event.id}&is_with_statistics=false`;
                this.selects.project.value = "Default";
                this.selects.project.selected = 0;

                this.selects.contract.url = `contracts?account_id=${event.id}`;
                this.selects.contract.value = "Default";
                this.selects.contract.selected = 0;
                contract_id = 0;

                this.selects.location.url = `locations?account=${event.id}&limit=500`;
                this.selects.location.value = "Default";
                this.selects.location.selected = 0;
                break;
            case "class" :
                if (this.ticket.class_id == event.id)
                    break;
            
              this.getCustomfield(event.id);
              break;
        }
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
            this.ticket.subject = htmlEscape(this.ticket.subject.trim());
            this.ticket.initial_post = htmlEscape(this.ticket.initial_post.trim()).substr(0, 4500);

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

            this.ticketProvider.addTicket(this.ticket).subscribe(
                data => {
                    if (!this.data.account)
            {
                this.config.setRecent({"account": this.selects.account,
                                       "location": this.selects.location,
                                               "project": this.selects.project,
                                               "class": this.selects.class,
                                               "contract_id": this.selects.contract.selected,
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
}

