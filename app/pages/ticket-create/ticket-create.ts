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

        this.users = {
            name: "User", 
            value: getFullName(he.firstname, he.lastname, he.email),
            selected: he.user_id,
        };

        this.accounts = {
            name: "Account", 
            value: he.account_name,
            selected: he.account_id || -1,
        };

        this.locations = {
            name: "Location", 
            value: "Default",
            selected: 0,
        };   

        this.technicians = {
            name: "Tech", 
            value: "Default",
            selected: 0,
        };
        
        this.projects = {
            name: "Project", 
            value: "Default",
            selected: 0,
        };
        
        this.classes = {
            name: "Class", 
            value: "Default",
            selected: 0,
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
        this.changes[event.type] = {id: event.id, name: event.name};
    }

    onSubmit(form) {
        if (form.valid){
            var subject = htmlEscape(this.ticket.subject.trim());
            var post = htmlEscape(this.ticket.initial_post.trim()).substr(0, 5000);
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

