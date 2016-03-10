import {Page, Config, NavController, NavParams, Modal, Alert} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
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
            { name: 'c0', value: 0 },
            { name: 'c1', value: 1 },
            { name: 'c2', value: 2 },
            { name: 'c3 Ego', value: 3 },
            { name: 'c4', value: 4 },
            { name: 'c5', value: 5 },
            { name: 'c6', value: 6 },
        ];
        
        let levels1 = [
            { name: 'c0', value: 0 },
            { name: 'c1', value: 1 },
            { name: 'c2', value: 2 },
            { name: 'c3 Ego', value: 3 },
            { name: 'c4', value: 4 },
        ];
        
        this.classes = {};
        this.classes.name = "Class";
        this.classes.value = "c1";
        this.classes.selected = 1;
        this.classes.items = classes1;
        
        this.levels = {};
        this.levels.name = "Level";
        this.levels.value = "c2";
        this.levels.selected = 2;
        this.levels.items = levels1;
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
    
    //get the full name of the following options:firstname, lastname, email,name
getFullName (firstname,lastname,email,name) {
    var fname = "";
    if (name)
        fname = name + " ";
    if (lastname)
        fname += lastname + " ";
    if (firstname)
        fname += firstname + " ";
    if (email && email.indexOf("@") > 0){
        if (!fname.trim())
            fname = email;
        else if (name)
            fname += " (" + email + ")";
    }
    return fname || "NoName";
}
    
    getCurrency(value) {
        if (!value)
            value = "0";
return this.config.current.currency + Number(value).toFixed(2).toString();
    }
    
      get Anotherdate(){ 
    return this.abc 
  }
  setDate(date) {
    this.Anotherdate = date;
    return this.Anotherdate;
  }
  set Anotherdate(date){ 
    this.abc = new Date(date)
  }

}
