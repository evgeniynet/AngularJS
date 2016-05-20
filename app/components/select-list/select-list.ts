import {IONIC_DIRECTIVES, NavController, Modal, Alert, Config} from 'ionic-angular';
import {ApiData} from '../../providers/api-data';
import {getFullName} from '../../directives/helpers';
import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {BasicSelectModal, InfinitySelectModal, AjaxSelectModal} from '../../pages/modals/modals';
import 'rxjs/add/operator/share';

const alertLimit = 5;

@Component({
    selector: 'select-list',
    templateUrl: 'build/components/select-list/select-list.html',
    directives: [IONIC_DIRECTIVES]
})
export class SelectListComponent {
    @Input() list: any;
    @Input() isbutton: boolean;
    @Input() customwidth: boolean;
    @Input() preload: boolean;
    @Input() ajax: boolean;
    @Output() public onChanged: EventEmitter<any> = new EventEmitter(false);
    selected: Object;
    init: boolean;
    url: string;

    constructor(private nav: NavController, private apiData: ApiData, private config: Config) {
        this.init = true;
        this.list = [];
        this.selected = {};
    }  

/*
    ngOnChanges(event) {
        console.log(event);
        if ("list" in event) {
            console.log(this.url);
            if (!event.list.isFirstChange() && event.list.currentValue.url !== this.url) {
                console.log(this.list.items)
                //this.list.hidden = true;
            }
        }
    }
*/
    ngOnInit() {
        if (this.list.url)
        {
            this.url = this.list.url;
             if (this.preload)
             {
                 this.loadData(false);
             }
         }
     }

     open()
     {
         this.loadData(true);
     }

     loadData (show)
     {
         if (this.url != this.list.url || !this.list.items || this.list.items.length == 0){
             if (this.list.url) {
                 this.apiData.get(this.list.url).subscribe(
                     data => {
                         this.list.items = data;
                         if (show) {
                             this.proceed_list();
                         }
                         this.url = this.list.url;
                     },
                     error => {
                         this.error("Cannot get " + this.list.name + " list! Error: " + error);
                         console.log(error || 'Server error');
                     }
                 );
             }
             else {
                 this.list.hidden = true;
                 this.error(this.list.name + ' list is empty!');
             }
     }
     else if (show) {
         this.proceed_list();
     }
 }

 error(message)
 {
     this.nav.alert(message, true);
 }

 proceed_list()
 {
     if (!this.list.items || this.list.items.length == 0)
     {
         this.list.value += " (no options)";
         //this.error(this.list.name + ' list is empty!');
         return;
     }
     if (!this.list.items[0].name){
         var results = [];
         this.list.items.forEach(item => {
             let name;
                 //if users or techs
                 if (item.email)
                     name = getFullName(item.firstname, item.lastname, item.email, " ");
                 //if tickets
                 else if (item.number)
                     name = `#${item.number}: ${item.subject}`;
                 results.push({id: item.id, name: name});
             });
         this.list.items = results;
     }

     //if (this.list.items.length <= alertLimit)
     //    this.openRadio();
     //else
         this.openModal();
 }

 emit_changed(value){
     this.list.value = value.name;
     value.type = this.list.name.split(' ').join('').toLowerCase();
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
         //.then(() => { this.testRadioOpen = true;});
     }

     openModal() {
         //TODO check counts: is more than 100 - do ajax
         let modal = this.list.items.length === 25 ? (this.ajax ? AjaxSelectModal : InfinitySelectModal) : BasicSelectModal;
         let myModal = Modal.create(modal, this.list);
         myModal.onDismiss(data => {
             if (data.name) {
                 this.selected = data;
                 this.emit_changed(data);
             }
         });
         setTimeout(() => {
             this.nav.present(myModal);
         }, 500);
     }

 }
