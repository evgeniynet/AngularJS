import {IONIC_DIRECTIVES, Nav, Modal, Alert, Config, Loading} from 'ionic-angular';
import {ApiData} from '../../providers/api-data';
import {getFullName} from '../../directives/helpers';
import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {BasicSelectModal, InfinitySelectModal, AjaxSelectModal} from '../../pages/modals/modals';

const alertLimit = 5;

@Component({
    selector: 'select-list',
    templateUrl: 'build/components/select-list/select-list.html',
    directives: [IONIC_DIRECTIVES]
})
export class SelectListComponent {
    @Input() list: any;
    @Input() isbutton: boolean;
    @Input() is_enabled: boolean = true;
    @Input() is_me: boolean;
    @Input() is_alt: boolean;
    @Input() preload: boolean;
    @Input() ajax: boolean;
    @Output() public onChanged: EventEmitter<any> = new EventEmitter(false);
    selected: Object = {};
    init: boolean = true;
    url: string;
    name: string = "";

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

        if (listname == "alt techs")
            this.name = "Alt " + this.config.current.names.tech.p;
        else if (listname == "alt users")
            this.name = "Alt " + this.config.current.names.user.p;
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

                 results.push({id: id, name: name, email: item.email});
                 

             });
         this.list.items = results;
         this.list.is_alt = this.is_alt;
     }



     //if (this.list.items.length <= alertLimit)
     //    this.openRadio();
     //else
         this.openModal();
     }
 }

 emit_changed(value){
     console.log("value", value);
     
     if (!value ) 
        return;

     if (this.is_alt)
     {
     let names = "";
     let ids = "";
     for (var n = 0;  n < value.length; n++) {
       names += value[n].name.replace("  (" +value[n].email+ ")", ",");
       ids += value[n].id + ", ";
     }
     ids = ids.slice(0,-1);
     names = names.slice(0,-1);
     console.log("ids", ids);
     this.list.value = names;
     value = {
         id: ids,
         name: names,
     };
     }
     else
     this.list.value = value.name;

     value.type = this.list.name.split(' ').join('').toLowerCase();
     this.selected = this.list.value;
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
         this.list.isbutton = this.isbutton;
         let len = this.list.items.length || 0;
         let modal = len >= 25 && len%25 == 0 || this.is_alt ? InfinitySelectModal : BasicSelectModal;
         let myModal = Modal.create(modal, this.list);
         let value = "";
         myModal.onDismiss(data => {
                 console.log("this.list.value", this.list.value);
                 this.selected = this.list.selected_items = data;
                 this.list.selected_items.forEach(select => {
                    select.is_selected = true;
                      });
                 console.log("this.selected", this.selected);
                 this.emit_changed(data);
             
         });
         this.nav.present(myModal);
     }

 }
