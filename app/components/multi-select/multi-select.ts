import {IONIC_DIRECTIVES, Nav, Modal, Alert, Config, Loading} from 'ionic-angular';
import {ApiData} from '../../providers/api-data';
import {getFullName} from '../../directives/helpers';
import {TicketProvider} from '../../providers/providers';
import {Component, Input, Output, EventEmitter, OnInit, OnChanges} from '@angular/core';
import {BasicSelectModal, InfinityMultiSelectModal, AjaxSelectModal} from '../../pages/modals/modals';

const alertLimit = 5;

@Component({
    selector: 'multi-select',
    templateUrl: 'build/components/multi-select/multi-select.html',
    directives: [IONIC_DIRECTIVES]
})
export class MultiSelectComponent {
    @Input() list: any;
    @Input() account_id: any;
    @Input() class_id: any;
    @Input() isbutton: boolean;
    @Input() is_enabled: boolean = true;
    @Input() is_me: boolean;
    @Input() preload: boolean;
    @Input() ajax: boolean;
    @Output() public onChanged: EventEmitter<any> = new EventEmitter(false);
    selected: Object = {};
    init: boolean = true;
    classes: any = {};
    url: string;
    contractors: number = 0;
    name: string = "";

    constructor(private nav: Nav, private apiData: ApiData, private ticketProvider: TicketProvider, private config: Config) {
        this.list = {};
    }  
    ngOnChanges(event) {
        if (this.list.name.toLowerCase() == "alt techs" && !event.account_id.isFirstChange() || this.list.name.toLowerCase() == "alt users" && !event.account_id.isFirstChange()) {
                    this.list.items.splice(0,this.contractors); 
                    this.getContractor(this.account_id);
            }
        if ("class_id" in event ) {
            if (this.list.name.toLowerCase() == "todo templates" && !event.class_id.isFirstChange() && !this.list.hidden) {
                this.selectTodoTemplate();
            }
        }
        }

    ngOnInit() {
        let listname = this.list.name.toLowerCase();
        
        if ((listname == "project" && !this.config.current.is_project_tracking) ||
            (listname == "todos" && !this.config.current.is_todos) ||
            (listname == "todo templates" && !this.config.current.is_todos) ||
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

        if (this.list.hidden)
            return;

        this.is_enabled = !this.list.is_disabled;

        if (listname == "alt techs")
            this.name = "Alt " + this.config.current.names.tech.p;
        else if (listname == "alt users")
            this.name = "Alt " + this.config.current.names.user.p;
        else{
            this.name = this.list.name;
            this.getClasses();
        }
        


        if (this.list.url)
        {
            this.url = this.list.url;
             if (this.preload)
             {
                 this.loadData(false);
             }
         }
     }

    // me()
    // {
    //    let he = this.config.getCurrent("user");
    //    let value = {
     //       id: he.user_id,
     //       name: getFullName(he.firstname, he.lastname, he.email)
     //   };
     //   this.emit_changed(value);
     //}

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
                         if(this.name == "Alt " + this.config.current.names.tech.p)
                             this.sortCheakIn(data);
                         else
                             this.list.items = data;
                                                
                         if (show) {
                             loading.dismiss();
                         }
                         this.proceed_list(show);
                         if (this.list.name.toLowerCase() == "alt users" || this.list.name.toLowerCase() == "alt techs")
                             this.getContractor(this.account_id);
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
     }



     //if (this.list.items.length <= alertLimit)
     //    this.openRadio();
     //else
         this.openModal();
     }
 }

 emit_changed(value){

     let names = "";
     let ids = "";
     if (this.list.name =='ToDo Templates'){
     for (var n = 0;  n < value.length; n++) {
       names += value[n].name + ", ";
       ids += value[n].id + ", ";
     }}
     else{
         for (var n = 0;  n < value.length; n++) {
           names += value[n].name.replace(" (" +value[n].email+ ")", ",");
           ids += value[n].id + ", ";
         }
     }
     ids = ids.slice(0,-1);
     names = names.slice(0,-2);
     this.list.value = names;
     value = {
         id: ids,
         name: names,
     };

     value.type = this.list.name.split(' ').join('').toLowerCase();
     this.selected = this.list.value;
     this.onChanged.emit(value);
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

    getClasses(){
     this.ticketProvider.getClasses().subscribe(
       data => {
         if (data){
             this.classes = data;         }
       },
       error => {
         console.log(error || 'Server error');
       }
       );
   }

   selectTodoTemplate(){
       let itemTodo;
       this.classes.forEach(item =>{
           if(item.id ==this.class_id)
               itemTodo = item.todo_templates;
       });
       if (itemTodo){
        itemTodo = itemTodo.replace(/-/g, '');   
        this.list.selected = itemTodo;
        let toDos = itemTodo.split(",");
        let itemsSelected = [];
        this.list.items.forEach(item=>{
            for (var i = 0; i < toDos.length; ++i) {
                if (item.id == toDos[i]){
                   itemsSelected.push(item);  
                }
                else
                   item.is_selected = false;  
            }
        });
        itemsSelected.forEach(item=>{
           item.is_selected = true; 
        });
        this.list.selected_items = itemsSelected;
        this.emit_changed(itemsSelected);
        }
        else{
           this.list.selected_items = [];
           this.list.selected = "";
           this.list.items.forEach(item=>{
               item.is_selected = false;
           });
           this.emit_changed(this.list.selected_items);
        }
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

     openModal() {
         //TODO check counts: is more than 100 - do ajax
         this.list.isbutton = this.isbutton;
         let len = this.list.items.length || 0;
         let modal = InfinityMultiSelectModal;
         let myModal = Modal.create(modal, this.list);
         let value = "";
         myModal.onDismiss(data => {
                 if (!data)
                     return;
                 this.selected = this.list.selected_items = data;
                     this.list.selected_items.forEach(select => {
                        select.is_selected = true;
                          });
                 
                 this.emit_changed(data);
             
         });
         this.nav.present(myModal);
     }

 }
