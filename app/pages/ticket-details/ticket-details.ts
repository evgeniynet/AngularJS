import {Page, Config, NavController, NavParams, Modal, Alert} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
import {PostsListComponent} from '../../components/posts-list/posts-list';
import {BasicSelectModal} from '../modals/modals';
import {GravatarPipe, LinebreaksPipe, DaysoldPipe} from '../../pipes/pipes';

@Page({
  templateUrl: 'build/pages/ticket-details/ticket-details.html',
    directives: [PostsListComponent],
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
        
        this.list = [
            { text: 'c0', value: '0' },
            { text: 'c1', value: '1' },
            { text: 'c2', value: '2' },
            { text: 'c3 Ego', value: '3' },
            { text: 'c4', value: '4' },
            { text: 'c5', value: '5' },
        ];
    }
    
    redirectOnEmpty(){
        this.alert.error('Incorrect ticket. Going back...', 'Oops!');
        
        setTimeout(() => {
  this.nav.pop();
}, 3000);
    }
    
    openModal(characterNum) {
        let data1 = {};
        data1.selected = this.tclass;
        data1.items = this.list;
        let myModal = Modal.create(BasicSelectModal, data1);
        myModal.onDismiss(data => {
            console.log(data);
            this.tclass = data.value;
            this.ticketclass = data.text;
        });
        this.nav.present(myModal);
    }
    
    ch(newValue) {
        //this.tclass = newValue;
    }
    
    doRadio() {
        let title="Class";
        
        let alert = Alert.create({
            title: 'Choose '+title,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: data => {
                        //console.log('Radio data:', data);
                        this.testRadioOpen = false;
                        this.radio = data;
                    }
                }
            ]
        });

        alert.addInput({
            type: 'radio',
            label: 'c0',
            value: '0',
            checked: true
        });

        alert.addInput({
            type: 'radio',
            label: 'c1',
            value: '1'
        });

        this.nav.present(alert).then(() => {
            this.testRadioOpen = true;
        });
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
