import {IONIC_DIRECTIVES, NavController, Modal, Alert} from 'ionic-framework/ionic';
import {Component, Input, Output, EventEmitter} from 'angular2/core';
//import {TicketDetailsPage} from '../../pages/ticket-details/ticket-details';
import {BasicSelectModal} from '../../pages/modals/modals';

const alertLimit = 5;

@Component({
    selector: 'select-list',
    templateUrl: 'build/components/select-list/select-list.html',
    directives: [IONIC_DIRECTIVES]
})
export class SelectListComponent {
    @Input() list: Array;
     @Output() onChanged: EventEmitter<any> = new EventEmitter();

     constructor(nav: NavController) {
        this.nav = nav;
        this.list = [];
         this.selected = {};
    }  
     
     open()
     {
         if (!this.list || !this.list.items || this.list.items.length == 0)
             return;
         
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
                 //checked: this.list.selected === item.value
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
