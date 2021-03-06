import {IONIC_DIRECTIVES, Nav, Modal, Alert, Config, Loading} from 'ionic-angular';
import {ApiData} from '../../providers/api-data';
import {getFullName} from '../../directives/helpers';
import {TicketProvider} from '../../providers/providers';
import {Component, Input, Output, EventEmitter, OnInit, OnChanges} from '@angular/core';
import {BasicSelectModal, InfinitySelectModal, AjaxSelectModal} from '../../pages/modals/modals';

const alertLimit = 5;

@Component({
    selector: 'select-list',
    templateUrl: 'build/components/select-list/select-list.html',
    directives: [IONIC_DIRECTIVES]
})
export class SelectListComponent {
    @Input() list: any;
    @Input() account_id: any;
    @Input() class_id: any;
    @Input() isbutton: boolean;
    @Input() is_enabled: boolean = true;
    @Input() is_once: boolean = false;
    //@Input() default: string = "";
    @Input() is_me: boolean;
    @Input() preload: boolean;
    @Input() ajax: boolean;
    @Output() public onChanged: EventEmitter<any> = new EventEmitter(false);
    selected: Object = {};
    init: boolean = true;
    contractors: number = 0;
    url: string;
    name: string = "";

    constructor(private nav: Nav, private ticketProvider: TicketProvider, private apiData: ApiData, private config: Config) {
        this.list = {};
    }  


 
    ngOnChanges(event) {
        
        if ("account_id" in event ) {
            if (this.list.name.toLowerCase() == "contract" && !event.account_id.isFirstChange() && !this.list.hidden) {
                this.loadData(false);
            }    
            else if (this.list.name.toLowerCase() == "tech" && !event.account_id.isFirstChange() && !this.list.hidden){
                if  (this.list.items.length){
                    this.list.items.splice(0,this.contractors); 
                    this.getContractor(this.account_id);
                }
            }
        }
        if ("class_id" in event ) {
            if (this.list.name.toLowerCase() == "todos" && !event.class_id.isFirstChange() && !this.list.hidden) {
                this.loadData(false);
            }
        }       
        /*if ("list" in event) {
            this.is_enabled = !this.list.is_disabled;
            console.log(this.url);
            if (!event.list.isFirstChange() && event.list.currentValue.url !== this.url) {
                console.log(this.list.items)
                //this.list.hidden = true;
            }
            
        }*/
    }

    ngOnInit() {
        let listname = this.list.name.toLowerCase();
        if ((listname == "project" && !this.config.current.is_project_tracking) ||
            (listname == "todos" && !this.config.current.is_todos) ||
            (listname == "location" && !this.config.current.is_location_tracking) ||
            ((listname == "contract" || listname == "prepaid pack") && !this.config.current.is_invoice) ||
            (listname == "priority" && !this.config.current.is_priorities_general) ||
            (listname == "account" && !this.config.current.is_account_manager) ||
            (listname == "level" && (!this.config.current.is_ticket_levels || (this.config.current.is_restrict_tech_escalate && !this.config.current.user.is_admin))) ||
            ((listname == "resolution" || listname == "category") && !this.config.current.is_resolution_tracking)) 
        {
            this.list.hidden = true;
        }

        this.is_enabled = !this.list.is_disabled;
        this.is_once = this.list.is_once;

        if ( listname == "tech" || listname == "user")
            this.list.displayname = this.name = (this.config.current.names[listname] || {}).a;
        else
            this.list.displayname = this.name = (this.config.current.names[listname] || {}).s || this.list.name;

        if (this.list.hidden)
            return;
        
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
        this.is_enabled = !this.list.is_disabled;
        if (this.is_enabled){
         this.loadData(true);
        }
     }

     loadData (show)
     {    
         if (this.url != this.list.url || !this.list.items || this.list.items.length == 0){
            let loading = null;
             if (this.list.url) {
                 if (show){
                     loading = Loading.create({
                     content: "Please wait...",
                     duration: 2000,
                     dismissOnPageChange: true
                 });
                 this.nav.present(loading);
             }

                 this.apiData.get(this.list.url).subscribe(
                     data => {
                         if(this.name =="Tech")
                             this.sortCheakIn(data);
                         else
                             this.list.items = data;
                         
                         if (loading) {
                             loading.dismiss();
                         }
                         this.proceed_list(show);
                         this.url = this.list.url;
                         if (this.list.name.toLowerCase() == "contract" && !this.list.is_default){
                             this.defaultContract();
                         }
                         if (this.list.name.toLowerCase() == "tech")
                             this.getContractor(this.account_id);
                     },
                     error => {
                         if (loading) loading.dismiss();
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

 defaultContract(){
     this.list.items.forEach(item => {
                                 if (item.default){
                                     this.list.selected = item.id;
                                     this.list.value = item.name; 
                                 }
                             });
 }

 sortCheakIn(data){
    var results = [];
    if (this.config.current.is_tech_checkin && this.config.current.is_restrict_transfer_to_in){
        data.forEach(item => {
            if (item.checkin_status == "IN")
                results.push(item);
        });
        this.list.items = results;
    }
    else
        this.list.items = data;
 }

 error(message)
 {
     this.nav.alert(message, true);
 }

 proceed_list(show)
 {
     if (!this.list.items || this.list.items.length == 0)
     {    
         this.list.value = this.list.default || "Default (nothing to select)";
         this.onChanged.emit({type: this.name.split(' ').join('').toLowerCase(), id: 0});
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
                 else if (item.fullname)
                     name = item.fullname;
                 else if (item.number)
                     name = `#${item.number}: ${item.subject}`;
                 else if (item.prepaid_pack_id) {
                     name = item.prepaid_pack_name;
                     id = item.prepaid_pack_id;
                 }

                 results.push({id: id, name: name, email: item.email});
                 

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
     if (value && this.is_once)
        this.is_enabled = false;
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

     getContractor(account_id)
   {
     this.ticketProvider.getContractor(account_id).subscribe(
       data => {
         this.contractors=data.length;
         if (data){
             data.forEach(item => {
                 item.lastname = "Contractor: " + item.lastname;
                 this.list.items.splice(0,0,item);
             });
         }
       },
       error => {
         console.log(error || 'Server error');
       }
       );
   }

     openModal() {
         //TODO check counts: is more than 100 - do ajax
         this.list.isbutton = this.isbutton;
         let len = this.list.items.length || 0;
         let modal = len >= 25 && len%25 == 0  ? InfinitySelectModal : BasicSelectModal;
         let myModal = Modal.create(modal, this.list);
         myModal.onDismiss(data => {
             if (data.name) {
                 this.selected = data;
                 this.emit_changed(data);
             }
         });
         this.nav.present(myModal);
     }

 }
