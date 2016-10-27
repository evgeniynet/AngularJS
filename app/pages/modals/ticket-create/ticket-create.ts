import {Page, Config, Nav, NavParams, ViewController, Modal} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {FORM_DIRECTIVES, Validators} from '@angular/common';
import {TicketProvider} from '../../../providers/providers';
import {htmlEscape, getFullName} from '../../../directives/helpers';
import {ClassListComponent} from '../../../components/class-list/class-list';
import {SelectListComponent} from '../../../components/select-list/select-list';
import {TicketDetailsPage} from '../../pages';

@Page({
    templateUrl: 'build/pages/modals/ticket-create/ticket-create.html',
    directives: [forwardRef(() => ClassListComponent), forwardRef(() => SelectListComponent)],
})
export class TicketCreatePage {

    data: any;
    ticket: any;
    he: any;
    selects: any;

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
                value: (recent.location || {}).value || "Default",
                selected: (recent.location || {}).selected || 0,
                url: `locations?account=${account_id}`,
                hidden: false
            },
            "project" : {
                name: "Project", 
                value: (recent.project || {}).value || "Default",
                selected: (recent.project || {}).selected || 0,
                url: `projects?account=${account_id}&is_with_statistics=false`,
                hidden: false
            },
            "class" : {
                name: "Class", 
                value: (recent.class || {}).value || "Default",
                selected: (recent.class || {}).selected || 0,
                url: "classes",
                hidden: false
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
            "location_id": null,
            "user_id" : this.he.user_id,
            "tech_id" : 0
        };
    }

    dismissPage(data) {
        this.viewCtrl.dismiss(data);
    }

    saveSelect(event){
        let name = event.type;
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
        //change url on related lists
        switch (name) {
            case "account" :
                this.selects.project.url = `projects?account=${event.id}&is_with_statistics=false`;
                this.selects.project.value = "Default";
                this.selects.project.selected = 0;

                this.selects.location.url = `locations?account=${event.id}`;
                this.selects.location.value = "Default";
                this.selects.location.selected = 0;
                break;
        }
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
            var subject = htmlEscape(this.ticket.subject.trim());
            var post = htmlEscape(this.ticket.initial_post.trim()).substr(0, 5000);

            this.ticket.class_id = this.selects.class.selected;
            this.ticket.account_id = this.selects.account.selected;
            this.ticket.location_id = this.selects.location.selected;
            this.ticket.user_id = this.he.is_techoradmin ? this.selects.user.selected : this.he.user_id;
            this.ticket.tech_id = this.selects.tech.selected;

            this.ticketProvider.addTicket(this.ticket).subscribe(
                data => {
                    if (!this.data.account)
            {
                this.config.setRecent({"account": this.selects.account,
                                       "location": this.selects.location,
                                               "project": this.selects.project,
                                               "class": this.selects.class});
            }
                    this.nav.alert(this.config.current.names.ticket.s + ' was Succesfully Created :)');
                    this.dismissPage(data);
                }, 
                error => { 
                    this.nav.alert(this.he.is_techoradmin ? ("Please select " + this.config.current.names.tech.s) : error, true);
                    console.log(error || 'Server error');}
            );
        }
    }
}

