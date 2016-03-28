import {IONIC_DIRECTIVES, NavController, Modal, Alert, Config} from 'ionic-angular';
import {ApiData} from '../../providers/api-data';
import {Component, Input, Output, EventEmitter, OnInit} from 'angular2/core';
import {TreeModal} from '../../pages/modals/modals';
import 'rxjs/add/operator/share';

const alertLimit = 10;

@Component({
    selector: 'class-list',
    templateUrl: 'build/components/class-list/class-list.html',
    directives: [IONIC_DIRECTIVES]
})
export class ClassListComponent {
    @Input() list: Array;
    @Input() preload: boolean;
     @Output() onChanged: EventEmitter<any> = new EventEmitter();

     constructor(nav: NavController, apiData: ApiData, config: Config) {
         this.init = true;
         this.nav = nav;
         this.config = config;
         this.apiData = apiData;
         this.list = {};
         this.selected = {};
     }  
     
     ngOnInit() {
         if (this.list.url)
         {
             if (this.preload)
             {
                 this.open();
             }
         }
     }

     open()
     {  
         if (!this.list.items || this.list.items.length == 0){
             if (this.list.url)
             {
                 this.apiData.get(this.list.url).subscribe(
                     data => {
                         this.list.items = data;
                         if (!this.preload)
                         {
                             this.proceed_list();
                         }
                         this.preload = false;
                     }, 
                     error => { 
                         this.error("Cannot get Classes list! Error: " + error);
                         console.log(error || 'Server error');}
                 );
             }
             else
                 this.error(this.list.name + ' list is empty!');
         }
         else
         {
             this.proceed_list();
         }
     }

     error(message)
     {
         this.config.alert.error(message, 'Oops!');
     }

     proceed_list()
     {
         let is_plain = true;
         this.list.items.forEach(item => {
             if (item.sub)
             {
                 is_plain = false;
                 return;    
             }
         });

         if (is_plain && this.list.items.length <= alertLimit)
             this.openRadio();
         else
             this.openModal();
     }

     emit_changed(value){
         value.name = this.findPath(" ", this.list.items, value.id);
         //this.list.value = value.name;
         value.type = "class";
         this.onChanged.emit(value);
     }

     findPath(path, array, id) {
         if (typeof array != 'undefined' && array) {
             for (var i = 0; i < array.length; i++) {
                 if (array[i].id == id) return array[i].name;
                 var path = this.findPath(path, array[i].sub, id);
                 if (path != null) {
                     return array[i].name + " / " + path;
                 }
             }
         }
         return null;
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
         let myModal = Modal.create(TreeModal, this.list);
         myModal.onDismiss(data => {
             if (data.name) {
                 this.selected = data;
                 this.emit_changed(data);
             }
         });
         this.nav.present(myModal);
     }

    }
