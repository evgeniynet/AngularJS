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
    @Input() required: boolean ;
    @Output() public onChanged: EventEmitter<any> = new EventEmitter(false);
    selected: Object = {};
    init: boolean = true;
    url: string;
    //name: string = "";
    custom_choices: Array<any>;
    custom_date: any;
    displayFormat: string;
    constructor(private nav: Nav, private apiData: ApiData, private config: Config) {
     }  

    ngOnInit() {
        this.displayFormat = getPickerDateTimeFormat(false, true);
        if (this.type == "select" ) {
            this.custom_choices = this.choices.split(/\r?\n/);
        }

        if (this.type == "checkbox") 
            this.custom_choices = this.choices.split(/\r?\n/);
        
        if (this.type == "date") 
          {  
            this.custom_date = new Date(this.value);
        }
     }

AddHours(date, hours)
{
    if (date){
        if (date.length == 19)
            date = date.slice(0,-3);
        let temp = new Date(date);
        return new Date(temp.setTime(temp.getTime() + hours*60*60*1000)).toJSON();
    }
    return date;
}

    getStartDate(time) {
        return  time = this.AddHours(time, this.config.getCurrent("timezone_offset"));
    }

    setStartDate(time){

            let JsonTime = this.AddHours(time, -1 * this.config.getCurrent("timezone_offset"));
            let obj = {
                       id: this.id,
                       name: this.name,
                       value: JsonTime
                     };
                     this.onChanged.emit(obj);            
    }

 error(message)
 {
     this.nav.alert(message, true);
 }

 changeText(text1)
 {
     this.value = text1.value.trim();
     
                     let obj = {
                       id: this.id,
                       name: this.name,
                       value: this.value
                     };
                     this.onChanged.emit(obj);
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

 openCheckbox() {       
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
                     this.value = data.join(", ");
                     let obj = {
                       id: this.id,
                       name: this.name,
                       value: this.value
                     };
                    this.onChanged.emit(obj);  
                 }
             }
         }
         ]
     });
     let checkValue = this.value.split(", ");
     this.custom_choices.forEach(item => {
         alert.addInput({
             type: 'checkbox',
             label: item,
             value: item,
             checked: checkValue.filter(tc => tc == item).length>0
             });
     });

     this.nav.present(alert);
         //.then(() => { this.testRadioOpen = true;});
     }     
 }
