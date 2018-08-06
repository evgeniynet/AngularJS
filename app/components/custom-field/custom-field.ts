import {IONIC_DIRECTIVES, Nav, Modal, Alert, Config, Loading} from 'ionic-angular';
import {ApiData} from '../../providers/api-data';
import {getFullName, getPickerDateTimeFormat} from '../../directives/helpers';
import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {BasicSelectModal, InfinitySelectModal, AjaxSelectModal} from '../../pages/modals/modals';

const alertLimit = 5;

@Component({
    selector: 'custom-field',
    templateUrl: 'build/components/custom-field/custom-field.html',
    directives: [IONIC_DIRECTIVES]
})
export class CustomFieldComponent {
    @Input() type: string;
    @Input() id: number;
    @Input() name: string ;
    @Input() choices: string;
    @Input() value: string ;
    @Input() list: any;
    @Input() isbutton: boolean;
    @Input() is_enabled: boolean = true;
    @Input() is_me: boolean;
    @Input() preload: boolean;
    @Input() ajax: boolean;
    @Output() public onChanged: EventEmitter<any> = new EventEmitter(false);
    selected: Object = {};
    init: boolean = true;
    url: string;
    //name: string = "";
    custom_choices: Array<any>;
    custom_date: any;
    displayFormat: string;
    constructor(private nav: Nav, private apiData: ApiData, private config: Config) {
        this.list = {};
     }  

    ngOnInit() {
        this.displayFormat = getPickerDateTimeFormat(false, true);
        if (this.type == "select") 
            this.custom_choices = this.choices.split("\n");
        
        if (this.type == "date")   {  
            this.custom_date = new Date(this.value);
            console.log(this.custom_date);
        }
     }

setMinTime(date) {
        return date.substring(0,4);
    }

    getStartDate(time) {
        return time.substring(0,19);
    }

    setStartDate(time){
        if (time)
        {
            this.value = time.substring(0,19);
        }
    }

 error(message)
 {
     this.nav.alert(message, true);
 }

 changeText(text1)
 {
     console.log("name", this.name);
     console.log("text1", text1.value);
     this.value = text1.value;
 }

 emit_changed(value){
     this.list.value = value.name;
     value.type = this.list.name.split(' ').join('').toLowerCase();
     this.onChanged.emit(value);
 }

 openRadio() {       
     let title=this.name;

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
                     //console.log(data);
                     this.value = data;
                     let obj = {
                       id: this.id,
                       name: this.name,
                       value: data
                     };
                     this.onChanged.emit(obj);  
                 }
             }
         }
         ]
     });

     this.custom_choices.forEach(item => {
          console.log(item);
         alert.addInput({
             type: 'radio',
             label: item,
             value: item,
                 //checked: this.list.selected === item.id
             });
     });

     this.nav.present(alert);
         //.then(() => { this.testRadioOpen = true;});
     }
 }
