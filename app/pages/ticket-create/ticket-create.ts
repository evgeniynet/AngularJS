import {Page, Config, NavController, NavParams} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
import {htmlEscape} from '../../directives/helpers';
import {SelectListComponent} from '../../components/select-list/select-list';

@Page({
    templateUrl: 'build/pages/ticket-create/ticket-create.html',
    directives: [SelectListComponent],
})
export class TicketCreatePage {
    constructor(nav: NavController, navParams: NavParams, dataProvider: DataProvider, config: Config) {
        this.nav = nav;
        this.config = config;
        this.alert = config.alert;
        this.navParams = navParams;
        this.ticket = this.navParams.data || {};
        //ticket.account_id

        this.classes = null;
        this.projects = null;
        this.dataProvider = dataProvider;

        this.ticket =
            {
            "subject" : "",
            "initial_post" : "",
            "class_id" : 0,
            "account_id" : 0,
            "location_id": 0,
            "user_id" : this.config.current.user.is_techoradmin ? 0 : this.config.current.user.user_id,
            "tech_id" : 0
        };

        let classes1 = [
            { name: 'General Inquiry', value: 0 },
            { name: 'API', value: 1 },
            { name: 'Helpdesk', value: 2 },
            { name: 'SherpaDesk', value: 3 },
            { name: 'Website', value: 4 },
            { name: 'Website 1', value: 5 },
            { name: 'Website', value: 6 },
        ];

        this.classes = {};
        this.classes.name = "Class";
        this.classes.value = "Default";
        this.classes.selected = 0;
        this.classes.items = classes1;
    }
    
    saveSelect(event){
        console.log(event);
    }

    onSubmit(form) {
        //if (form.valid){
        var subject = htmlEscape(this.ticket.subject.trim());
        var post = htmlEscape(this.ticket.initial_post.trim());
        if(subject === "" || $("#addTicketTechs").val() === "" || selectedEditClass < 1)
        {
            this.alert.error("Please enter subject", 'Oops!');
        }
        else if (subject.length > 100){
            this.alert.error("Subject should be less 100 chars!", 'Oops!');	
        } 
        else if (post.length > 5000) {
            this.alert.error("Details cannot be more than 5000 chars!", 'Oops!');
        }
        else {
            this.dataProvider.addTicket(this.ticket).subscribe(
                data => {
                    this.alert.success("", 'Ticket was Succesfully Created :)');
                    setTimeout(() => {
                        this.nav.pop();
                    }, 3000); 
                }, 
                error => { 
                    console.log(error || 'Server error');}
            );
        }
        //else this.alert.error('Please enter subject', 'Oops!');
    }
}

