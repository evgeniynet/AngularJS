import {Page, Config, NavController, NavParams} from 'ionic-framework/ionic';
import { FORM_DIRECTIVES, Validators} from 'angular2/common';
import {DataProvider} from '../../providers/data-provider';
import {htmlEscape, getFullName} from '../../directives/helpers';
import {SelectListComponent} from '../../components/select-list/select-list';
import {ClassListComponent} from '../../components/class-list/class-list';
import {TicketDetailsPage} from '../ticket-details/ticket-details';
import {AddUserPage} from '../add-user/add-user';

@Page({
    templateUrl: 'build/pages/ticket-create/ticket-create.html',
    directives: [SelectListComponent, ClassListComponent],
})
export class TicketCreatePage {
    constructor(nav: NavController, navParams: NavParams, dataProvider: DataProvider, config: Config) {
        this.nav = nav;
        this.config = config;
        this.alert = config.alert;
        this.navParams = navParams;
        this.changes = {};
        let he = this.config.current.user;

        let account_id = he.account_id || -1;

        this.selects = {
            "user" : {
                name: "User", 
                value: getFullName(he.firstname, he.lastname, he.email),
                selected: he.user_id,
                url: "users",
                hidden: false
            },
            "account" : {
                name: "Account", 
                value: he.account_name,
                selected: account_id,
                url: "accounts?is_with_statistics=false",
                hidden: false
            },
            "location" : {
                name: "Location", 
                value: "Default",
                selected: 0,
                url: `locations?account=${account_id}`,
                hidden: false
            },
            "tech" : {
                name: "Tech", 
                value: "Default",
                selected: 0,
                url: "technicians",
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

        this.dataProvider = dataProvider;

        this.ticket =
            {
            "subject" : "",
            "initial_post" : "",
            "class_id" : null,
            "account_id" : -1,
            "location_id": null,
            "user_id" : this.config.current.user.is_techoradmin ? 1325 : this.config.current.user.user_id,
            "tech_id" : 1325
        };
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
        if (form.valid){
            var subject = htmlEscape(this.ticket.subject.trim());
            var post = htmlEscape(this.ticket.initial_post.trim()).substr(0, 5000);
            
            this.ticket.class_id = this.selects.class.id;
            this.ticket.account_id = this.selects.account.id;
            this.ticket.location_id = this.selects.location.id;
            this.ticket.tech_id = this.selects.tech.id;
           
            this.dataProvider.addTicket(this.ticket).subscribe(
                data => {
                    this.alert.success("", 'Ticket was Succesfully Created :)');
                    setTimeout(() => {
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

