import {Page, NavController, NavParams, Modal, Alert} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
import {PostsListComponent} from '../../components/posts-list/posts-list';
import {BasicSelectModal} from '../modals/modals';
import {GravatarPipe, LinebreaksPipe} from '../../pipes/pipes';

@Page({
  templateUrl: 'build/pages/ticket-details/ticket-details.html',
    directives: [PostsListComponent],
    pipes: [GravatarPipe, LinebreaksPipe],
})
export class TicketDetailsPage {
    constructor(nav: NavController, navParams: NavParams, dataProvider: DataProvider) {
        this.nav = nav;
        this.tclass = '1';
        this.ticketclass = "c0";
        this.details_tab = "Reply";
        this.navParams = navParams;
        this.dataProvider = dataProvider;
        this.ticket = this.navParams.data || {};
        this.details = {};
        this.posts = [];
        this.post1=[];
         this.dataProvider.getTicketDetails(this.ticket.key).subscribe(
             data => {this.details = data;
                      this.post1 = [data.ticketlogs.shift()];
                      this.posts = data.ticketlogs;}, 
            error => { 
                console.log(error || 'Server error');}
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
        let alert = Alert.create();
        alert.setTitle('Lightsaber color');

        alert.addInput({
            type: 'radio',
            label: 'Blue',
            value: 'blue',
            checked: true
        });

        alert.addInput({
            type: 'radio',
            label: 'Green',
            value: 'green'
        });

        alert.addButton('Cancel');
        alert.addButton({
            text: 'Ok',
            handler: data => {
                console.log('Radio data:', data);
                this.testRadioOpen = false;
                this.testRadioResult = data;
            }
        });

        this.nav.present(alert).then(() => {
            this.testRadioOpen = true;
        });
    }
}
