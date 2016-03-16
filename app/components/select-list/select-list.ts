import {IONIC_DIRECTIVES, NavController, Modal, Alert} from 'ionic-framework/ionic';
import {ApiData} from '../../providers/api-data';
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
    @Input() url: string;
     @Output() onChanged: EventEmitter<any> = new EventEmitter();

     constructor(nav: NavController, apiData: ApiData) {
        this.nav = nav;
         this.apiData = apiData;
        this.list = [];
         this.url = "";
         this.selected = {};
         if (this.list.items && this.list.items.length > 0)
         this.proceed_list();
    }  
     
     open()
     {
         if (!this.list.items || this.list.items.length == 0){
         if (this.url)
         {
             //this.apiData.Cache = this.apiData.get(this.url).share();
             
             //this.apiData.Cache.subscribe(
             this.apiData.get(this.url).subscribe(
                 data => {
                     this.list.items = data;
                     this.proceed_list();
                 }, 
                 error => { 
                     console.log(error || 'Server error');}
             );
         }
         }
         else
             this.proceed_list();
     }
     
     proceed_list()
     {
         if (this.list.items.length <= alertLimit)
             this.openRadio();
         else
             this.openModal();
     }
     
     emit_changed(value){
        this.list.value = value.name;
        var data = {};
         data["'"+this.list.name+"'"] = value;
     this.onChanged.emit(data);
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
