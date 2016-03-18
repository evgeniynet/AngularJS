import {Page, Config, NavController, NavParams} from 'ionic-framework/ionic';
import { FORM_DIRECTIVES, Validators} from 'angular2/common';
import {DataProvider} from '../../providers/data-provider';
import {htmlEscape} from '../../directives/helpers';
import {SelectListComponent} from '../../components/select-list/select-list';
import {ClassListComponent} from '../../components/class-list/class-list';
import {TicketDetailsPage} from '../ticket-details/ticket-details';

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
        this.ticket = this.navParams.data || {};
        //ticket.account_id

        let classes1 = [
            {
                id: 0
                name: 'Root1',
                children: [
                {
                name: 'Child1',
                id: 4,
                children: [
                {
                name: 'Child111',
                id: 41
            }, {
                name: 'Child211',
                id: 51,
            }
        ]
    }, {
        name: 'Child2',
            id: 5,
    }
            ]
    },
        {
            id: 1
            name: 'Root2',
                children: [
                    {
                        name: 'Child21',
                        id: 4
                    }, {
                        name: 'Child22',
                        id: 5,
                    }
                ]
        }
];

this.classes = {};
this.classes.name = "Class";
this.classes.value = "Helpdesk";
this.classes.selected = 2;
this.classes.items = classes1;


this.accounts = {
    name: "Account", 
    value: "Bigwebapps",
    selected: -1,
};

this.projects = null;
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

let others1 = [
    { name: 'General Inquiry', id: 0 },
    { name: 'API', id: 1 },
    { name: 'Helpdesk', id: 2 },
    { name: 'SherpaDesk', id: 3 },
    { name: 'Website', id: 4 },
    { name: 'Website 1', id: 5 },
    { name: 'Website', id: 6 },
];

this.others = {};
this.others.name = "Other";
this.others.value = "Helpdesk";
this.others.selected = 2;
this.others.items = others1;
}

saveSelect(event){
    console.log(event);
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
}

