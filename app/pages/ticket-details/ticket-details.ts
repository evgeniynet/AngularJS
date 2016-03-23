import {Page, Config, NavController, NavParams} from 'ionic-framework/ionic';
import { FORM_DIRECTIVES, Validators} from 'angular2/common';
import {DataProvider} from '../../providers/data-provider';
import {getCurrency, getFullName, fullapplink} from '../../directives/helpers';
import {PostsListComponent} from '../../components/posts-list/posts-list';
import {SelectListComponent} from '../../components/select-list/select-list';
import {ClassListComponent} from '../../components/class-list/class-list';
import {GravatarPipe, LinebreaksPipe, DaysoldPipe} from '../../pipes/pipes';

@Page({
    templateUrl: 'build/pages/ticket-details/ticket-details.html',
    directives: [PostsListComponent, SelectListComponent, ClassListComponent],
    pipes: [GravatarPipe, LinebreaksPipe, DaysoldPipe],
})
export class TicketDetailsPage {
    constructor(nav: NavController, navParams: NavParams, dataProvider: DataProvider, config: Config) {
        this.nav = nav;
        this.config = config;
        this.alert = this.config.alert;
        this.navParams = navParams;
        this.dataProvider = dataProvider;
        this.ticket = {};
    }

    onPageLoaded()
    {
        let he = this.config.current.user;
        this.details_tab = "Reply";
        let data = (this.navParams || {}).data || {};
        let account_id = -1;
        
        this.selects = {
            "location" : {
                name: "Location", 
                value: data.location_name,
                selected: data.location_id,
                url: `locations?account=${account_id}`,
                hidden: false
            },
            "tech" : {
                name: "Tech", 
                value: getFullName(data.technician_firstname || data.tech_firstname, data.technician_lastname || data.tech_lastname,  data.technician_email || data.tech_email),
                selected: data.tech_id,
                url: "technicians",
                hidden: false
            },
            "project" : {
                name: "Project", 
                value: data.project_name,
                selected: data.project_id,
                url: `projects?account=${account_id}&is_with_statistics=false`,
                hidden: false
            },
            "level" : {
                name: "Level", 
                value: data.level+ " - " +data.level_name,
                selected: data.level,
                url: "levels",
                hidden: false
            },
            "priority" : {
                name: "Project", 
                value: data.priority + " - " + data.priority_name,
                selected: data.priority_id,
                url: "priorities",
                hidden: false
            },
            "class" : {
                name: "Class", 
                value: data.class_name,
                selected: data.class_id,
                url: "classes",
                hidden: false
            }
        };
        
        let resolution1 = [
            { name: 'Resolved', id: 0 },
            { name: 'UnResolved', id: 1 },
        ];

        this.resolution = {};
        this.resolution.name = "Resolution";
        this.resolution.value = "Resolved";
        this.resolution.selected = 0;
        this.resolution.items = resolution1;


        this.resolution_category = {};
        this.resolution_category.name = "Category";
        this.resolution_category.value = "Testing";
        this.resolution_category.selected = 3;
        this.resolution_category.items =
            resolution1;
        //returnData.resolution_categories;

        /*this.ticket =
            {
            "subject" : "",
            "initial_post" : "",
            "class_id" : null,
            "account_id" : -1,
            "location_id": null,
            "user_id" : this.config.current.user.is_techoradmin ? 1325 : this.config.current.user.user_id,
            "tech_id" : 1325
        };
        */
        
        let isFullInfo = (data.ticketlogs && data.ticketlogs.length > 0);

        if (!isFullInfo)
        {            this.dataProvider.getTicketDetails(data.key).subscribe(
            data => {
                this.processDetails(data);
            }, 
            error => { 
                console.log(error || 'Server error');
                this.redirectOnEmpty();}
        ); 
        }

        this.processDetails(data, !isFullInfo);
    }

    processDetails(data, isShortInfo)
    {
        if (!isShortInfo && (!data || !data.ticketlogs || data.ticketlogs == 0))
        { 
            this.redirectOnEmpty();
            return;
        }
        
        this.ticket = data;
        
        if (!isShortInfo)
        {
            this.attachments = data.attachments;
            this.post1 = [data.ticketlogs.shift()];
            this.posts = data.ticketlogs;
        }
    }

    redirectOnEmpty(){
        this.alert.error('Incorrect ticket. Going back...', 'Oops!');

        setTimeout(() => {
            this.nav.pop();
        }, 3000);
    }

    saveSelect(event){
        let name = event.type;
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
    }
    
    onUpdate() {
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



    ch(newValue) {
        //this.tclass = newValue;
    }

    getFullapplink(ticketkey) {
        return fullapplink("site", ticketkey, "inst","org");
    }
    
    getFullName (firstname,lastname,email,name) {
        return getFullName (firstname,lastname,email,name);
    }

    getCurrency(value) {
        return getCurrency(value, this.config.current.currency);
    }

    setDate(date) {
        return new Date(date);
    }

}
