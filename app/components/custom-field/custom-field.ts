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
        this.displayFormat = getPickerDateTimeFormat(false, true);
        if (this.type == "select") 
            this.custom_choices = this.choices.split(",");
        console.log(this.custom_choices);
        
        if (this.type == "date")   {  
            this.custom_date = new Date(this.value);
            console.log(this.custom_date);
        }
        /*
        let listname = this.list.name.toLowerCase();
        if ((listname == "project" && !this.config.current.is_project_tracking) ||
            (listname == "location" && !this.config.current.is_location_tracking) ||
            (listname == "priority" && !this.config.current.is_priorities_general) ||
            (listname == "account" && !this.config.current.is_account_manager) ||
            (listname == "level" && (!this.config.current.is_ticket_levels || (this.config.current.is_restrict_tech_escalate && !this.config.current.user.is_admin))) ||
            ((listname == "resolution" || listname == "category") && !this.config.current.is_resolution_tracking)) 
        {
            this.list.hidden = true;
        }

        this.is_enabled = !this.list.is_disabled;

        if (this.list.hidden)
            return;

        if ( listname == "tech" || listname == "user")
            this.name = (this.config.current.names[listname] || {}).a;
        else
            this.name = (this.config.current.names[listname] || {}).s || this.list.name;


        if (this.list.url)
        {
            this.url = this.list.url;
             if (this.preload)
             {
                 this.loadData(false);
             }
         }
     }

     me()
     {
        let he = this.config.getCurrent("user");
        let value = {
            id: he.user_id,
            name: getFullName(he.firstname, he.lastname, he.email)
        };
        this.emit_changed(value);
     }

     open()
     {
         this.loadData(true);
     }

     loadData (show)
     {
         if (this.url != this.list.url || !this.list.items || this.list.items.length == 0){
             if (this.list.url) {
                 let loading = null;
                 if (show){
                     loading = Loading.create({
                     content: "Please wait...",
                     //duration: 2000,
                     dismissOnPageChange: true
                 });
                 this.nav.present(loading);
             }

                 this.apiData.get(this.list.url).subscribe(
                     data => {
                         this.list.items = data;
                         if (show) {
                             loading.dismiss();
                         }
                         this.proceed_list(show);
                         this.url = this.list.url;
                     },
                     error => {
                         if (show) loading.dismiss();
                         this.error("Cannot get " + this.name + " list! Error: " + error);
                         console.log(error || 'Server error');
                     }
                 );
             }
             else {
                 this.list.hidden = true;
                 this.error(this.name + ' list is empty!');
             }
     }
     else
         this.proceed_list(show);
*/ }

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

 proceed_list(show)
 {
     if (!this.list.items || this.list.items.length == 0)
     {
         this.list.value = "Default (nothing to select)";
         //this.open = function { return false; };
         //this.error(this.list.name + ' list is empty!');
         return;
     }
     if (show) {
     if (!this.list.items[0].name){
         var results = [];
         this.list.items.forEach(item => {
             let name;
             let id = item.id;
                 //if users or techs
                 if (item.email)
                     name = getFullName(item.firstname, item.lastname, item.email, this.isbutton ? "" : " ");
                 //if tickets
                 else if (item.number)
                     name = `#${item.number}: ${item.subject}`;
                 else if (item.prepaid_pack_id) {
                     name = item.prepaid_pack_name;
                     id = item.prepaid_pack_id;
                 }

                 results.push({id: id, name: name});
                 

             });
         this.list.items = results;
     }



     //if (this.list.items.length <= alertLimit)
     //    this.openRadio();
     //else
         this.openModal();
     }
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
                     console.log(data);
                     data = this.value;
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
