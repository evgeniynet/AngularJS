import {IONIC_DIRECTIVES, NavController, Modal, Alert, Config} from 'ionic-framework/ionic';
import {ApiData} from '../../providers/api-data';
import {getFullName} from '../../directives/helpers';
import {Component, Input, Output, EventEmitter} from 'angular2/core';
//import {TicketDetailsPage} from '../../pages/ticket-details/ticket-details';
import {BasicSelectModal} from '../../pages/modals/modals';
import 'rxjs/add/operator/share';

const alertLimit = 5;

@Component({
    selector: 'select-list',
    templateUrl: 'build/components/select-list/select-list.html',
    directives: [IONIC_DIRECTIVES]
})
export class SelectListComponent {
    @Input() list: Array;
    //@Input() url: string;
     @Output() onChanged: EventEmitter<any> = new EventEmitter();

     constructor(nav: NavController, apiData: ApiData, config: Config) {
         this.init = true;
        this.nav = nav;
         this.config = config;
         this.apiData = apiData;
         this.list = {};
         //this.url = this.list.url;
         this.selected = {};
    }  
     
     open()
     {
         if (this.list.url)
         {
             //this.apiData.Cache = this.apiData.get(this.list.url).share();
             
             //this.apiData.Cache.subscribe(
             this.apiData.get(this.list.url).subscribe(
                 data => {
                     this.list.items = data;
                     this.proceed_list();
                 }, 
                 error => {
                     this.error("Cannot get " +this.list.name + " list! Error: " + error);
                     console.log(error || 'Server error');}
             );
         }
     }
     
     error(message)
     {
         this.config.alert.error(message, 'Oops!');
     }
     
     proceed_list()
     {
         if (!this.list.items || this.list.items.length == 0)
             {
                 this.error(this.list.name + ' list is empty!');
                 return;
             }
         if (!this.list.items[0].name){
         var results = [];
         this.list.items.forEach(item => {
             let name = getFullName(item.firstname,item.lastname,item.email, " ");
             results.push({id: item.id, name: name});
         });
             this.list.items = results;
         }
         
         if (this.list.items.length <= alertLimit)
             this.openRadio();
         else
             this.openModal();
     }
     
     emit_changed(value){
        this.list.value = value.name;
         value.type = this.list.name.toLowerCase();
     this.onChanged.emit(value);
     }
     
     openRadio() {         
         let title=this.list.name;

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
                     text: 'OK',
                     handler: data => {
                         if(data){
                         this.testRadioOpen = false;
                         this.selected = data;
                         this.emit_changed(data);
                         }
                     }
                 }
             ]
         });
         
         this.list.items.forEach(item => {
             alert.addInput({
                 type: 'radio',
                 label: item.name,
                 value: item,
                 //checked: this.list.selected === item.id
             });
         });

         this.nav.present(alert).then(() => {
             this.testRadioOpen = true;
         });
     }
     
     openModal() {
         let myModal = Modal.create(BasicSelectModal, this.list);
         myModal.onDismiss(data => {
             if (data.name) {
             this.selected = data;
             this.emit_changed(data);
             }
         });
         this.nav.present(myModal);
     }
  
}
