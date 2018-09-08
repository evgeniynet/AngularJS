import {IONIC_DIRECTIVES, Nav, Modal, Alert, Config} from 'ionic-angular';
import {ApiData} from '../../providers/api-data';
import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {TreeModal} from '../../pages/modals/modals';
import 'rxjs';

const alertLimit = 10;

@Component({
    selector: 'class-list',
    templateUrl: 'build/components/class-list/class-list.html',
    directives: [IONIC_DIRECTIVES]
})
export class ClassListComponent {
    @Input() list: any = {};
    @Input() preload: boolean;
    @Output() public onChanged:EventEmitter<any> = new EventEmitter(false);
    init: boolean = true;
    selected: Object = {};
    url: any;

     constructor(private nav: Nav, private apiData: ApiData, private config: Config) {
     }  

     ngOnInit() {
         if (!this.config.current.is_class_tracking)
         {
             this.list.hidden = true;
             return;
         }
         if (this.list.url) {
             this.url = this.list.url;
             if (this.preload) {
                 this.loadData(false);
             }
         }
     }

     open() {
         this.loadData(true);
     }

     loadData(show) {
         if (this.url != this.list.url || !this.list.items || this.list.items.length == 0) {
             if (this.list.url) {
                 this.apiData.get(this.list.url).subscribe(
                     data => {
                         this.list.items = data;
                         this.proceed_list(show);
                         this.url = this.list.url;
                     },
                     error => {
                         this.error("Cannot get " + this.list.name + " list! Error: " + error);
                         console.log(error || 'Server error');
                     }
                 );
             }
             else
                 this.error(this.list.name + ' list is empty!');
         }
         else {
             this.proceed_list(show);
         }
     }

     error(message)
     {

         this.nav.alert(message, true);
     }

     proceed_list(show)
     {
         //if (!this.config.getCurrent("is_tech"))
         //    this.list.items = this.list.items.filter(v => { return !v.is_restrict_to_techs });

         this.list.items = this.list.items.filter(v => { return v.is_active });

         if (!this.list.items || this.list.items.length == 0)
         {
             this.list.value = "Default (nothing to select)";
             //this.error(this.list.name + ' list is empty!');
             return;
         }
         if (show) {
             if (this.list.items[0].name != "Default (no selection)")
               this.list.items.splice(0, 0, {hierarchy_level:0,id:0,is_active:true,is_lastchild:true,name:"Default (no selection)"});  
         //let is_plain = !this.list.items.filter(v => { return v.sub });

         //if (is_plain && this.list.items.length <= alertLimit)
         //    this.openRadio();
         //else
             this.openModal();
     }
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

         this.nav.present(alert);
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
