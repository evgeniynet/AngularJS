import {Page, Config, NavController, NavParams, Modal, Alert} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
import {getCurrency, getFullName} from '../../directives/helpers';
import {PostsListComponent} from '../../components/posts-list/posts-list';
import {SelectListComponent} from '../../components/select-list/select-list';
import {BasicSelectModal} from '../modals/modals';
import {GravatarPipe, LinebreaksPipe, DaysoldPipe} from '../../pipes/pipes';

@Page({
  templateUrl: 'build/pages/ticket-details/ticket-details.html',
    directives: [PostsListComponent, SelectListComponent],
    pipes: [GravatarPipe, LinebreaksPipe, DaysoldPipe],
})
export class TicketDetailsPage {
    constructor(nav: NavController, navParams: NavParams, dataProvider: DataProvider, config: Config) {
        this.nav = nav;
        this.config = config;
        this.alert = this.config.alert;
        this.tclass = '1';
        this.ticketclass = "c0";
        this.details_tab = "Reply";
        this.navParams = navParams;
        this.dataProvider = dataProvider;
        this.ticket = (this.navParams || {}).data || {};
        this.posts = [];
        this.post1=[];
        
        let classes1 = [
            { name: 'General Inquiry', value: 0 },
            { name: 'API', value: 1 },
            { name: 'Helpdesk', value: 2 },
            { name: 'SherpaDesk', value: 3 },
            { name: 'Website', value: 4 },
            { name: 'Website 1', value: 5 },
            { name: 'Website', value: 6 },
        ];
        
        let levels1 = [
            { name: 'First Resolution', value: 0 },
            { name: 'Pre-Development', value: 1 },
            { name: 'Active Plate', value: 2 },
            { name: 'Testing', value: 3 },
        ];
        
        let resolution1 = [
            { name: 'Resolved', value: 0 },
            { name: 'UnResolved', value: 1 },
        ];
        
        let resolution_category1 = [
            { name: 'First Resolution', value: 0 },
            { name: 'Pre-Development', value: 1 },
            { name: 'Active Plate', value: 2 },
            { name: 'Testing', value: 3 },
        ];


        this.classes = {};
        this.classes.name = "Class";
        this.classes.value = "General Inquiry";
        this.classes.selected = 0;
        this.classes.items = classes1;
        
        this.levels = {};
        this.levels.name = "Level";
        this.levels.value = "Pre-Development";
        this.levels.selected = 1;
        this.levels.items = levels1;
        

        this.priority = {};
        this.priority.name = "Priority";
        this.priority.value = "Testing";
        this.priority.selected = 3;
        this.priority.items = levels1;

        this.tech = {};
        this.tech.name = "Tech";
        this.tech.value = "Testing";
        this.tech.selected = 3;
        this.tech.items = levels1;

        this.location = {};
        this.location.name = "Location";
        this.location.value = "Testing";
        this.location.selected = 3;
        this.location.items = levels1;

        this.project = {};
        this.project.name = "Project";
        this.project.value = "Testing";
        this.project.selected = 3;
        this.project.items = levels1;
        

        this.resolution = {};
        this.resolution.name = "Resolution";
        this.resolution.value = "Resolved";
        this.resolution.selected = 0;
        this.resolution.items = resolution1;
        

        this.resolution_category = {};
        this.resolution_category.name = "Category";
        this.resolution_category.value = "Testing";
        this.resolution_category.selected = 3;
        this.resolution_category.items = resolution_category1;
        this.dataProvider.getTicketDetails(this.ticket.key).subscribe(
             data => {
                 if (!data || !data.ticketlogs || data.ticketlogs == 0)
                    { this.redirectOnEmpty();
                     return;
                    }
                 this.ticket = data;
                 this.attachments = data.attachments;
                      this.post1 = [data.ticketlogs.shift()];
                      this.posts = data.ticketlogs;}, 
            error => { 
                console.log(error || 'Server error');
            this.redirectOnEmpty();}
        ); 
    }
    
    redirectOnEmpty(){
        this.alert.error('Incorrect ticket. Going back...', 'Oops!');
        
        setTimeout(() => {
  this.nav.pop();
}, 3000);
    }
    
    saveSelect(event){
        console.log(event);
    }
    
    ch(newValue) {
        //this.tclass = newValue;
    }
    
getFullName (firstname,lastname,email,name) {
    return getFullName (firstname,lastname,email,name);
}
    
    getCurrency(value) {
        return getCurrency(value, this.config.current.currency);
    }
    
  setDate(date) {
    this.Anotherdate = date;
    return this.Anotherdate;
  }

}
