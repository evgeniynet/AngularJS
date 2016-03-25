import {Page, Config, NavController, NavParams, ViewController} from 'ionic-framework/ionic';
import {forwardRef} from 'angular2/core';
import {FORM_DIRECTIVES, Validators} from 'angular2/common';
import {DataProvider} from '../../../providers/data-provider';
import {htmlEscape, getFullName} from '../../../directives/helpers';
import {ClassListComponent} from '../../../components/class-list/class-list';
import {SelectListComponent} from '../../../components/select-list/select-list';
import {TicketDetailsPage} from '../../ticket-details/ticket-details';
import {AddUserPage} from '../../add-user/add-user';

@Page({
    templateUrl: 'build/pages/modals/ticket-create/ticket-create.html',
    directives: [ClassListComponent, forwardRef(() => SelectListComponent)],
})
export class TicketCreatePage {
    constructor(nav: NavController, navParams: NavParams, dataProvider: DataProvider, config: Config,
                 private viewCtrl: ViewController) {
        this.nav = nav;
        //this.viewCtrl = viewCtrl;
        this.config = config;
        this.alert = config.alert;
        this.navParams = navParams;
        this.dataProvider = dataProvider;
    }

    onPageLoaded()
    {
        this.he = this.config.current.user;

        this.data = (this.navParams || {}).data || {};

        let account_id = (this.data.accounts || {}).id || this.he.account_id || -1;

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
                value: "Default",
                selected: 0,
                url: `locations?account=${account_id}`,
                hidden: false
            },
            "project" : {
                name: "Project", 
                value: "Default",
                selected: 0,
                url: `projects?account=${account_id}&is_with_statistics=false`,
                hidden: false
            },
            "class" : {
                name: "Class", 
                value: "Default",
                selected: 0,
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
            value: (this.data.account || {}).name || this.he.account_name,
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

    dismissPage() {
        this.viewCtrl.dismiss();
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
                this.alert.error('Please select technician...', 'Oops!');
                return;
            }
            */
        if (form.valid){
            var subject = htmlEscape(this.ticket.subject.trim());
            var post = htmlEscape(this.ticket.initial_post.trim()).substr(0, 5000);

            this.ticket.class_id = this.selects.class.id;
            this.ticket.account_id = this.selects.account.id;
            this.ticket.location_id = this.selects.location.id;
            this.ticket.user_id = this.he.is_techoradmin ? this.selects.user.id : this.he.user_id;
            this.ticket.tech_id = this.selects.tech.id;

            this.dataProvider.addTicket(this.ticket).subscribe(
                data => {
                    this.alert.success("", 'Ticket was Succesfully Created :)');
                    setTimeout(() => {
                        this.dismissPage();
                        
                        if(!this.data.tech && !this.data.accont)
                        this.nav.push(TicketDetailsPage, data);
                    }, 3000); 
                }, 
                error => { 
                    console.log(error || 'Server error');}
            );
        }
    }

    addUser(type)
    {
        this.nav.push(AddUserPage, type);
    }
}

