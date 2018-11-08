import {Page, Config, Nav, NavParams, Modal, Alert} from 'ionic-angular';
import {FORM_DIRECTIVES, Validators} from '@angular/common';
import {AppSite} from '../../providers/config';
import {DataProvider} from '../../providers/data-provider';
import {TicketProvider} from '../../providers/ticket-provider';
import {getDateTime, htmlEscape, getCurrency, getFullName, fullapplink, mailtolink, parseXml, FileUrlHelper} from '../../directives/helpers';
import {PostsListComponent} from '../../components/posts-list/posts-list';
import {SelectListComponent}  from '../../components/select-list/select-list';
import {MultiSelectComponent}  from '../../components/multi-select/multi-select';
import {ClassListComponent} from '../../components/class-list/class-list';
import {LocationListComponent} from '../../components/location-list/location-list';
import {CloseTicketModal, TransferTicketModal, ChangeUserModal} from '../../pages/modals/modals';
import {TimelogPage} from '../../pages/timelog/timelog'; 
import {ExpenseCreatePage} from '../../pages/expense-create/expense-create';
import {GravatarPipe, LinebreaksPipe, DaysoldPipe, DaysagoPipe, HtmlsafePipe} from '../../pipes/pipes';
import {AddFilesModal} from '../../pages/modals/add-files/add-files';
import {TodoListComponent} from '../../components/todo-list/todo-list';
import {Component, ElementRef, Input, OnInit, ViewChild, Renderer, Output, EventEmitter, forwardRef} from "@angular/core";
import {IONIC_DIRECTIVES, Loading} from 'ionic-angular';
import {ApiSite} from '../../providers/config';
import {CustomFieldComponent} from '../../components/custom-field/custom-field';
/**
 * Upload button component.
 *
 * As native input elements with type file are diffcult to style, it is common practice to hide them
 * and trigger the needed events manually as it done here. A button is is used for user interaction,
 * next to the hidden input.
 *
 *  <code>
 *    @Component({
 *      directives: [UploadButton],
 *    })
 *    class UploadComponent {
 *        private addCallback: Function = (files: FileList) => {...};
 *        private icon: String = "add-circle";
 *    }
 *
 *      <upload-button
 *          (filesUploaded)="uploadFile($event)  <!-- the callback function executes after adding files -->
 *          [btnStyle]="icon"               <!-- the ionic-icon name to use for button -->
 *          [logCallback]="console.debug">  <!-- (optional) if needed a logger can be set -->
 *          [allowMultiple]="false">        <!-- (optional) disable multiple file upload -->
 *      </upload-button>
 *  </code>
 */
 @Component({
   selector: "upload-button",
   directives: [IONIC_DIRECTIVES],
   templateUrl: 'build/components/upload-button/upload-button.html',
 })
 export class UploadButtonComponent {

  /**
   * Native upload button (hidden)
   */
   @ViewChild("input")
   private nativeInputBtn: ElementRef;

  /**
   * The callback executed when files are selected, set by parent
   */
   @Output() public filesSelected: EventEmitter<any> = new EventEmitter(false);

  /**
   * The callback executed when files are uploaded, set by parent
   */
   @Output() public filesUploaded: EventEmitter<any> = new EventEmitter(false);

 /*** The destination of file 
      { ticket: "",
        account: "",
        asset: "",
        post_id: 0 
      }
      */
      @Input() private fileDest: String;


      /*** The existing files
        to pevent dup filenames
        */
        @Input() private filesExist: Array<any>;

  /**
   * The callback executed when button pressed, set by parent
   */
   @Input() private btnStyle: String;

  /**
   * (Optional) Can be used to disable adding multiple files
   */
   @Input() private allowMultiple: boolean = true;

  /**
   * String used for control multiple uploads
   */
   private multi: string = "multiple";
   private error: string = "";
   private files: any = [];
   private in_progress: any;
   private MAX_SIZE : number = 104857600; // 100 MB


  /**
   * (Optional) if needed a logger can be used
   */
   @Input()
   private logCallback: Function;

  /**
   * Constructor
   *
   * @param  {Renderer} renderer for invoking native methods
   * @param  {Log}      logger instance
   */
   constructor(private nav: Nav, private renderer: Renderer, private config: Config) {
     if (this.allowMultiple === false) {
       this.multi = "";
     }
   }

   ngOnInit() {
     //console.log("######################i nininiini");
   }

   public upload (url: string, files: File[]): Promise<any> {
     return new Promise((resolve, reject) => {

       let xhr:XMLHttpRequest = new XMLHttpRequest();

       xhr.onreadystatechange = () => {
         if (xhr.readyState === 4) {
           if (xhr.status === 200) {
             resolve(xhr.response); //JSON.parse(xhr.response)
           } else {
             reject(xhr.response);
           }
         }
       };

       let token = this.config.getCurrent("key"),
       org = this.config.getCurrent("org"), // localStorage.getItem('userOrgKey'),
       inst = this.config.getCurrent("instance");// localStorage.getItem('userInstanceKey');

       xhr.open('POST', url+"files/", true);
       xhr.setRequestHeader("Authorization", "Basic " + btoa(`${org}-${inst}:${token}`));
       //xhr.withCredentials = true;
       //console.log(this.fileDest);
       let formData: FormData = new FormData();
       for ( var key in this.fileDest ) {
         formData.append(key, this.fileDest[key]);
       }
       for (let i = 0; i < files.length; i++) {
         formData.append("uploads[]", files[i], files[i].upload_name);
       }
       xhr.send(formData);
     });
   }

   onUpload(is_Close?) {
     //console.log("upload start");
     if (!this.files.length) {
       this.filesUploaded.next("ok" + " no files " + (is_Close ? " on close" : ""));
       return;
     }
     //proof double click
     if (this.in_progress && Date.now() - this.in_progress < 1500) {return;}
     this.in_progress = Date.now();

     let loading = null;

     if (this.files.length >= 2 || this.files[0].size > 20000)
     {
       loading = Loading.create({
         content: "Uploading file(s)...",
         //duration: 2000,
         dismissOnPageChange: true
       });
       this.nav.present(loading);
     }

     this.upload(ApiSite, this.files).then((data) => {
       this.reset();
       if (loading) loading.dismiss();
       this.filesUploaded.next("ok " + data + (is_Close ? " on close" : ""));
     }).catch((ex) => {
       if (loading) 
       {
         setTimeout(() => loading.dismiss(), 1000);
       }
       console.error('Error uploading files', ex);
       this.filesUploaded.next("error " + ex);
       this.nav.alert('Error uploading files! Cannot add files! Please try again later ... or try to upload one file or check your internet connection', true);
     });
   }

   reset(file?)
   {
     if (file)
     {
       this.files = this.files.filter(item => item !== file);
       this.filesSelected.next(this.files.map(item => item.upload_name));
     }
     if (!file || !this.files.length) {
       this.error = "";
       this.files = [];
       this.nativeInputBtn.nativeElement.value = '';
     }

   }

  /**
   * Callback executed when the visible button is pressed
   *
   * @param {Event} event should be a mouse click event
   */
   public callback(event: Event): void {
     this.log("UploadButton: Callback executed triggerig click event", this.nativeInputBtn.nativeElement);

     // trigger click event of hidden input
     let clickEvent: MouseEvent = new MouseEvent("click", {bubbles: true});
     this.renderer.invokeElementMethod(
       this.nativeInputBtn.nativeElement, "dispatchEvent", [clickEvent]);
   }

  /**
   * Callback which is executed after files from native popup are selected.
   *
   * @param {Event} event change event containing selected files
   **/ 
   filesAdded(event: Event) {
     this.log("UploadButton: Added files", this.nativeInputBtn.nativeElement.files);
     let len = this.nativeInputBtn.nativeElement.files.length;
     let checkfiles: any = [];
     this.error = "";
     if (len){
       let selNames={}, existNames={};
       if (this.filesExist)
         for (let j = 0; j < this.filesExist.length; j++) {
           existNames[this.filesExist[j].name.trim()] = this.filesExist[j].size;
         }
         for (let i = 0; i < len; i++) {
           let file = this.nativeInputBtn.nativeElement.files[i];
           if (this.isFile(file)){
             if (file.size > this.MAX_SIZE)
               this.error += `File ${file.name} will be skipped. It is more 100 MB<br>`;
             else if (file.size === 0)
               this.error += `File ${file.name} will be skipped. It has zero size <br>`;
             else if (!file.name.trim())
               this.error += `File #${i} will be skipped. It has empty name<br>`;
             else
             {
               let new_name = file.name.trim();
               //detect aleady uploaded dup
               if (file.size != (existNames[new_name.trim()] || file.size))
                 new_name = this.add_tag(new_name,file.size);
               //detect selected dup
               if (file.size != (selNames[new_name] || file.size))
                 new_name = this.add_tag(new_name,file.size);

               file.upload_name = new_name;
               checkfiles.push(file);
               selNames[new_name] = file.size;
             }
           }
           else 
           {
             this.error += `File #${i} will be skipped. It is empty<br>`;
           }
         }
       }
       this.files = checkfiles;
       this.filesSelected.next(this.files.map(item => item.upload_name));
     }

     add_tag(name, tag) {
       var index = name.lastIndexOf("."),
       len = name.length;
       return name.substr(0,index)+"_"+tag+name.substr(index,len);
     }

  /**
   * (Optional) If needed for debugging
   *
   * @param {any[]} ...args console.log like paramter <code>log("Error", obj, 1)</code>
   */
   private log(...args: any[]): void {
     if (this.logCallback) {
       console.log(args);
       //this.logCallback(args);
     }
   }

   humanizeBytes(bytes: number) {
     if (bytes === 0) {
       return '0 Byte';
     }
     let k = 1024;
     const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
     let i: number = Math.floor(Math.log(bytes) / Math.log(k));

     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
   }

   isImage(url) {
     if (!url || url.trim().match(/(jpeg|jpg|gif|png|ico)$/i) === null)
       return "md-document";
     return  "md-image";
   }

   isFile(file: any): boolean {
     return file !== null && file instanceof Blob;
   }

 }


 @Page({
   templateUrl: 'build/pages/ticket-details/ticket-details.html',
   directives: [TodoListComponent, CustomFieldComponent, PostsListComponent, forwardRef(() => SelectListComponent), forwardRef(() => MultiSelectComponent), forwardRef(() => ClassListComponent), forwardRef(() => LocationListComponent), UploadButtonComponent],
   pipes: [GravatarPipe, LinebreaksPipe, DaysoldPipe, DaysagoPipe, HtmlsafePipe],
 })
 export class TicketDetailsPage {

   counts: any;
   ticket: any = {};
   userphone: string;
   customfields: any = [];
   technicians: any = [];
   users: any = [];
   subject: any;
   next_step: any;
   next_step_date: any;
   pager: any;
   details_tab: string;
   active: boolean;
   waiting_response: boolean = false;
   he: any;
   techname: string;
   username: string;
   selects: any;
   select_button: any;
   ticketnote: string;
   attachments: any;
   is_editworkpad: boolean = true;
   disable: boolean = false;
   cachename: string = "";
   closed_index: number = 0;
   fileDest: any = {ticket: ""};
   files: any = [];
   is_showlogs: boolean = false;
   showSubjChange: boolean;
   posts: any = [
   {
     "id": 0,
     "ticket_key": "",
     "user_id": 0,
     "user_email": " ",
     "user_firstname": " ",
     "user_lastname": " ",
     "record_date": "2016-01-01T00:00:00.0000000",
     "log_type": "Initial Post",
     "note": " ",
     "workpad": " ",
     "ticket_time_id": 0,
     "sent_to": " ",
     "is_waiting": false,
     "sla_used": 0
   }];

   constructor(private nav: Nav, private navParams: NavParams, private ticketProvider: TicketProvider, private dataProvider: DataProvider, private config: Config) {
   }

   onPageLoaded() {

     this.ticket.customfields = [];
     this.active = true;
     this.he = this.config.getCurrent("user");
     this.details_tab = "Reply";
     let data = this.navParams.data || {};
     this.cachename = data.cachename;
     this.posts[0].record_date = data.updated_time || this.posts[0].record_date;

     this.is_showlogs = false;
     this.ticketnote = "";

     this.fileDest = {ticket: data.key};

     this.getPosts(data.key);

     this.processDetails(data, true);
   }

   initSelects(data){
     let account_id = data.account_id || -1;
     this.username = getFullName(data.user_firstname, data.user_lastname, data.user_email);
     this.techname = getFullName(data.technician_firstname || data.tech_firstname, data.technician_lastname || data.tech_lastname, data.technician_email || data.tech_email);
     let contract_id = data.default_contract_id || 0;
     let contract_name = data.default_contract_name;

    
     this.select_button = {
       "tech": {
         name: "Tech",
         value: "Transfer "+this.config.current.names.ticket.s,
         selected: data.tech_id,
         url: "technicians",
         hidden: false
       },
     };
     this.selects = {
       "altusers" : {
         name: "Alt Users", 
         value: this.username,
         selected: data.user_id,
         url: "users",
         hidden: false
       },
       "location": {
         name: "Location",
         value: data.location_name || "( Not Set )",
         selected: data.location_id || 0,
         url: `locations?account=${account_id}&limit=500`,
         hidden: false
       },
       "alttechs": {
         name: "Alt Techs",
         value: this.techname,
         selected: data.tech_id,
         url: "technicians",
         hidden: false
       },
       "project": {
         name: "Project",
         value: data.project_name || "( Not Set )",
         selected: data.project_id || 0,
         url: `projects?account=${account_id}&is_with_statistics=false`,
         hidden: false
       },
       "contract" : { 
         name: "Contract", 
         value: contract_name || "Choose",
         selected: contract_id || this.config.getRecent("contract").selected || 0,
         url: `contracts?account_id=${account_id}`,
         hidden: false    
                },
       "level": {
         name: "Level",
         value: data.level_name ? (data.level + " - " + data.level_name) : "( Not Set )",
         selected: data.level || 0,
         url: "levels",
         hidden: false
       },
       "priority": {
         name: "Priority",
         value: data.priority_name ? (data.priority + " - " + data.priority_name) : "( Not Set )",
         selected: data.priority_id || 0,
         url: "priorities",
         hidden: false
       },
       "class": {
         name: "Class",
         value: data.class_name || "( Not Set )",
         selected: data.class_id || 0,
         url: "classes",
         hidden: false
       }
     };

     this.selects.account = {
       name: "Account", 
       value: (data.account || {}).name || data.account_name || this.he.account_name,
       selected: account_id,
       url: "accounts?is_with_statistics=false",
       hidden: false
     };
   }

   uploadedFile(event)
   {
     //console.log("Uploaded:", event);
     if (event.indexOf("ok") == 0)
     {
       this.onSubmit(!this.config.current.user.is_techoradmin && this.ticket.status != 'Closed' && ~event.indexOf("close")); 
     }
   }

   selectedFile(event)
   {
     this.files = event;
     this.ticketnote = this.ticketnote.trim(); 
     if (event.length && !this.ticketnote)
     {
       this.ticketnote = "  ";
     }
   }

   getPosts(key)
   {
     this.ticketProvider.getTicketDetails(key).subscribe(
       data => {
         this.processDetails(data);
       },
       error => {
         console.log(error || 'Server error');
         this.redirectOnEmpty();
       }
       );
   }

   getProfile(user_id)
   {
     this.ticketProvider.getUserProfile(user_id).subscribe(
       data => {
         this.userphone = data.mobile_phone || data.phone;
       },
       error => {
         console.log(error || 'Server error');
       }
       );
   }

   getCustomfield(class_id)
   {
     if (class_id == 0)
           return this.customfields = [];
     this.ticketProvider.getCustomfields(class_id, this.pager).subscribe(
       data => {
         if (data.length == 0){
           this.customfields = data;
           return;
         }
         if (this.ticket.customfields.length != data.length) {
           this.customfields = data;
         return;
         }
         for (var n = 0; n<this.ticket.customfields.length; n++)
         { 
           data.filter(tc => tc.id.toString() == this.ticket.customfields[n].id.toString())[0].value = this.ticket.customfields[n].value;
         }
         this.customfields = data;
       },
       error => {
         console.log(error || 'Server error');
       }
       );
   }

   processDetails(data, isShortInfo?)
   {
     if (!isShortInfo && (!data || !data.ticketlogs || data.ticketlogs == 0))
     { 
       this.redirectOnEmpty();
       return;
     }
     
     this.ticket = data;
     this.is_editworkpad = !(this.ticket.workpad || "").length;
     this.ticket.customfields = [];
     this.technicians = data.technicians;
     this.users = data.users;
     this.ticket.mailto = `r.${this.config.current.org}.${this.config.current.instance}.${data.key}@app.sherpadesk.com`;

     this.initSelects(data);

     if (data.ticketlogs && data.ticketlogs.length > 0)
       this.posts = data.ticketlogs; 

     if (!isShortInfo)
     {
       this.attachments = (data.attachments || []).slice().reverse();

       let xml = parseXml(this.ticket.customfields_xml);
       if (xml)
       {
         let t=[];
         for (var n = xml.documentElement.firstChild; n; n = n.nextSibling)
         { 
           t.push({ "id": n.attributes[0].nodeValue, "name": n.firstChild.innerHTML.replace("&amp;amp;","&amp;"), "value": (n.firstChild.nextSibling.innerHTML || "").replace("&amp;amp;","&amp;")}); 
         }
         this.ticket.customfields = t;
         this.getCustomfield(data.class_id);
       }
     }
     if (data.user_id){
      this.getProfile(data.user_id);
     }
   }

   redirectOnEmpty(){
     this.nav.alert('Incorrect ticket. Going back...', true);

     setTimeout(() => {
       this.nav.pop();
     }, 1000);
   }

   saveSelect(event){
     let name = event.type;
     this.selects[name].selected = event.id;
     this.selects[name].value = event.name;
     let contract_id = this.selects.contract.selected;

      switch (name) {
            case "account" :
              if (this.ticket.account_id == event.id) 
              break;
                this.selects.project.url = `projects?account=${event.id}&is_with_statistics=false`;
                this.selects.project.value = "Default";
                this.selects.project.selected = 0;

                this.selects.contract.url = `contracts?account_id=${event.id}`;
                this.selects.contract.value = "Default";
                this.selects.contract.selected = 0;
                contract_id = 0;
                
                this.selects.location.url = `locations?account=${event.id}&limit=500`;
                this.selects.location.value = "Default";
                this.selects.location.selected = 0;
                break;
            case "class" :
              if (this.ticket.class_id == event.id) 
              break;
              this.getCustomfield(event.id);
              break;
            
        }
   }

   saveCustomfield(event){
     this.customfields.filter(tc => tc.id == event.id)[0].value = event.value;
   }

   onSubmit(isClose?) {
     //proof double click
     if (this.ticket.in_progress && Date.now() - this.ticket.in_progress < 1500) {return;}
     this.ticket.in_progress = Date.now();

     var post = htmlEscape(this.ticketnote.trim()).substr(0, 5000);

     if (isClose && this.files.length || !isClose)
     {
       this.ticketProvider.addTicketPost(this.ticket.id, post, this.files, this.waiting_response).subscribe(
         data => {
           if (!isClose)
           { 
             this.nav.alert('New post added :)');
             this.ticketnote = "";
             this.active = false;
             setTimeout(() => this.active = true, 0);
             this.getPosts(this.ticket.key);
           }
           this.files = [];
         },
         error => {
           this.nav.alert(error, true);
           console.log(error || 'Server error');
         }
         );
     }
     if (isClose)
     {
       this.onClose(true);
     }
   } 

   saveNote(form) {
     var note = htmlEscape((form.value || "").trim()).substr(0, 5000);
     if (note != (this.ticket.note || "").trim()) {
       this.ticketProvider.addTicketNote(this.ticket.id, note).subscribe(
         data => this.saveNoteSuccess(note),
         error => {
           this.nav.alert(error, true);
           console.log(error || 'Server error');
         }
         );
     }
     else
       this.saveNoteSuccess(note);
   }

   saveWorkpad(form) {
     var workpad = (form.value || "").trim().replace(/\n/g, "<p>"); 
     if (workpad != (this.ticket.workpad || "").trim()) {
       this.ticketProvider.addTicketWorkpad(this.ticket.id, workpad).subscribe(
         data => this.saveWorkpadSuccess(workpad),
         error => {
           this.nav.alert(error, true);
           console.log(error || 'Server error');
         }
         );
     }
     else
       this.saveWorkpadSuccess(workpad);
   }

    openAlert(name, value) {

    if (!value || value.length < 22) 
    return;        

     let alert = Alert.create({
         title: name,
         subTitle: value,
         buttons: [
         {
             text: 'Ok',
             role: 'cancel',
         }]
         });

     this.nav.present(alert);
     }

   saveWorkpadSuccess(workpad){
     this.nav.alert('Workpad saved :)');
     this.ticket.workpad = (workpad || "").trim();
     this.is_editworkpad = !this.ticket.workpad.length;
   }

   saveNoteSuccess(note){
     this.nav.alert('Note saved :)');
     this.ticket.note = (note || "").trim();
   }

   onClose(isForce?) {
     //proof double click
     if (!isForce && this.ticket.in_progress && Date.now() - this.ticket.in_progress < 1500) {return;}
     this.ticket.in_progress = Date.now();

     var post = htmlEscape(this.ticketnote.trim()).substr(0, 5000);

     let data = {
       "status": "closed",
       "note_text": post,
       "is_send_notifications": true,
       "resolved": true,
       "resolution_id": 0,
       "confirmed": true,
       "confirm_note": ""

     };

     this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(
       data => {
         this.update_tlist_logic(true);
         this.nav.alert(this.config.current.names.ticket.s + ' has been closed :)');
         this.ticket.status = "Closed";
         if (post.length){
           this.ticketnote = "";
           this.active = false;
           setTimeout(() => this.active = true, 0);
           this.files = [];
           this.getPosts(this.ticket.key);
         }
       },
       error => {
         this.nav.alert(error, true);
         console.log(error || 'Server error');
       }
       );
   }

    onHold() {

      if (this.ticket.status == "OnHold")
      {
        this.reopenTicket();
        return;
      }

      let prompt = Alert.create({
             title: 'Place On Hold #' + this.ticket.number,
             inputs: [
             {
                 name: 'note',
                 placeholder: 'Note'
             },
             ],
             buttons: [
             {
                 text: 'Cancel',
                 handler: data => {
                     console.log('Cancel clicked');
                 }
             },
             {
                 text: 'Place On Hold',
                 handler: data => {

                     var post = htmlEscape(data.note.trim()).substr(0, 4000);

                     let data1 = {
                       "status": "onhold",
                       "note_text": post
                     };

                     this.ticketProvider.closeOpenTicket(this.ticket.key, data1).subscribe(
                       data => {
                         this.ticket.status = "OnHold";
                         this.update_tlist_logic(false);
                         this.nav.alert(this.config.current.names.ticket.s + ' placed On Hold :)');
                       },
                       error => {
                         this.nav.alert(error, true);
                         console.log(error || 'Server error');
                       }
                       );
                 }
             }
             ]
         });

         this.nav.present(prompt);
   }

   getXML()
   {
      var customfield_xml = "";
          for (var n = 0;  n < this.customfields.length; n++)
         { 
           if (this.customfields[n].required && this.customfields[n].value == "" || this.customfields[n].value == "0001-01-01T00:00:00.0000000"){
             this.nav.alert(`Please add value to custom field: ${this.customfields[n].name}`, true);
             return customfield_xml = "";
           }
           customfield_xml = customfield_xml + `<field id="${this.customfields[n].id}"><caption>${this.customfields[n].name}</caption><value>${this.customfields[n].value}</value></field>`;
         }
      return "<root>" + customfield_xml + "</root>";  

   }

   onUpdate() {
     //proof double click
     if (this.ticket.in_progress && Date.now() - this.ticket.in_progress < 1500) {return;}
     this.ticket.in_progress = Date.now();
     var customfields_xml = this.getXML();
     if (customfields_xml == "") {
       return;
     }
     let data = {
       "class_id": this.selects.class.selected,
       "level_id": this.selects.level.selected,
       "priority_id": this.selects.priority.selected,
       "project_id": this.selects.project.selected,
       "location_id": this.selects.location.selected,
       "account_id": this.selects.account.selected,
       "tech_id": this.selects.alttechs.selected,
       "user_id": this.selects.altusers.selected,
       "customfields_xml": customfields_xml,
       "default_contract_id": this.selects.contract.selected,
       "default_contract_name": this.selects.contract.value
     };

     this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(
       data => {
         this.nav.alert(this.config.current.names.ticket.s + ' was successfully updated :)');
         this.getPosts(this.ticket.key);
       },
       error => {
         console.log(error || 'Server error');
       }
       );
   }

   

   pickUp() {

     let data = {
       "action": "pickup",
       "note_text": ""
     };

     //proof double click
     if (this.ticket.in_progress && Date.now() - this.ticket.in_progress < 1500) {return;}
     this.ticket.in_progress = Date.now();

     this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(
       data => {
         this.nav.alert(this.config.current.names.ticket.s + ' pickup was Succesfull!');
         this.techname = this.ticket.tech_firstname = getFullName(this.he.firstname, this.he.lastname, this.he.email);
         this.ticket.tech_lastname = this.ticket.tech_email = "";
         //this.selects.tech.selected = this.he.user_id;
         this.getPosts(this.ticket.key);
       },
       error => {
         this.nav.alert(error, true);
         console.log(error || 'Server error');
       }
       );
   }

   onDelete(file){
     let data = {
       "ticket": this.ticket.key,
       "file_id": file.id
     };

     this.dataProvider.deleteFile(data).subscribe(
       data => {
         this.attachments = this.attachments.filter(item => item !== file);
         this.getPosts(this.ticket.key);
         this.nav.alert(`File ${file.name} deleted!`);
       },
       error => {
         this.nav.alert(error, true);
         console.log(error || 'Server error');
       }
       );
   }

   reopenTicket() {
     let data = {
       "status": "open",
       "note_text": ""
     };

     this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(
       data => {
         this.update_tlist_logic(false);
         this.nav.alert(this.config.current.names.ticket.s + ' has been Reopened!');
         this.ticket.status = "Open";
       },
       error => {
         this.nav.alert(error, true);
         console.log(error || 'Server error');
       }
       );
   }

   update_tlist_logic(is_close)
   {
     if (this.cachename){
       if(~this.cachename.indexOf("closed")){
         is_close = !is_close;
         this.closed_index = 0;
       }
       if (is_close) {
         this.closed_index = this.ticketProvider._dataStore[this.cachename].findIndex(tkt => tkt.key === this.ticket.key);
         this.ticketProvider._dataStore[this.cachename].splice(this.closed_index,1);
         if(~this.cachename.indexOf("closed"))
         {
           this.ticketProvider._dataStore[this.cachename.replace("closed", "open")].splice(0, 0, this.ticket);
         }
       }
       else
       {
         this.ticketProvider.getTicketsList(this.cachename, "", "",{ "limit": 25 });
         this.ticketProvider._dataStore[this.cachename].splice(this.closed_index, 0, this.ticket);
         let index = this.ticketProvider._dataStore[this.cachename].findIndex(tkt => tkt.key === this.ticket.key);
         if(~this.cachename.indexOf("closed")){
           this.ticketProvider._dataStore[this.cachename.replace("open","closed")].splice(this.ticketProvider._dataStore[this.cachename.replace("open","closed")].findIndex(tkt => tkt.key === this.ticket.key),1);
         }
       }
     }
   }


   closeTicket(timeAdded?) {
     if (this.ticket.status == 'Closed') {
       this.reopenTicket();
       return;
     }
     console.log(timeAdded);
     if (this.config.current.is_force_time_on_closing_tickets && !timeAdded){
       this.addTime(true);
       return;
     }
     let myModal = Modal.create(CloseTicketModal, { "number": this.ticket.number, "key": this.ticket.key, "subject": this.ticket.subject });
     myModal.onDismiss(data => {
       if (data){
         this.ticket.status = "Closed";
         this.update_tlist_logic(true);
       }
     });
     this.nav.present(myModal);
   }  

   cheakAllowsToReopen(){
     if(this.config.current.is_allows_tech_to_reopen == false)
       return false;
     let daysago = this.dayOld(this.posts[0].record_date);
     if (this.config.current.days_allowed_to_reopen <= daysago)
       return false;
    return true;
   }

   dayOld(value) {
        value = value || 0;
        if (isNaN(value))
            value = Math.round((new Date().getTime() - +new Date(value + "Z")) / 60000);
        var daysAgo: number = value / 60;
        var result : string = "";
                if (!value || value < 2)
                  result = "0"; 
                else
                  result = parseInt((daysAgo / 24).toString()) + "";
                    return result;
    } 

   transferTicket() {
     let myModal = Modal.create(TransferTicketModal, { "number": this.ticket.number, "key": this.ticket.key, "subject": this.ticket.subject,  "tech_firstname": this.ticket.tech_firstname, "tech_lastname": this.ticket.tech_lastname});
     myModal.onDismiss(data => {
       if (data){
         this.techname = this.ticket.tech_firstname = data.name;
         this.ticket.tech_lastname = this.ticket.tech_email = "";
         this.getPosts(this.ticket.key);
       }
     });
     this.nav.present(myModal);
   }  

   changeUser() {
     let myModal = Modal.create(ChangeUserModal, { "number": this.ticket.number, "key": this.ticket.key, "subject": this.ticket.subject,  "user_firstname": this.ticket.user_firstname, "user_lastname": this.ticket.user_lastname});
     myModal.onDismiss(data => {
       if (data){
         this.username = this.ticket.user_firstname = data.name;
         this.ticket.user_lastname = this.ticket.user_email = "";
         this.getPosts(this.ticket.key);
       }
     });
     this.nav.present(myModal);
   }  

   changeSubject(name1){
     this.subject = name1.viewModel;
   }

   changeNextStep(name2){
     this.next_step = name2.viewModel;
   }

   ChangeSubject() {
     if (!this.subject || this.subject == "")
     this.subject = this.ticket.subject; 
     if (!this.next_step || this.next_step == "") 
     this.next_step = this.ticket.next_step; 
     this.next_step_date = new Date().toJSON();    
            
            this.ticketProvider.addTicketSubject(this.ticket.key, this.subject, this.next_step).subscribe(
       data => {
         this.nav.alert('Subject on the ' + this.config.current.names.ticket.s + ' has been changed :)');
         this.ticket.subject = this.subject;
         if (this.ticket.next_step != this.next_step)
           this.ticket.next_step_date = this.next_step_date;
         this.ticket.next_step = this.next_step;  
         this.showSubjChange = !this.showSubjChange;
         this.ticketProvider.getTicketsList(this.cachename, "", "",{ "limit": 25 });
       },
       error => {
         this.nav.alert(error, true);
         console.log(error || 'Server error');
       }
       );
      }
    
   cancelSubject(){
     this.changeSubject(this.ticket.subject);
     this.changeNextStep(this.ticket.next_step);
     this.showSubjChange = !this.showSubjChange;
   }

   addTime(isClose?)
   {
     let myModal = Modal.create(TimelogPage, { "number": this.ticket.number, "ticket_number": this.ticket.key, "subject": this.ticket.subject, "account_id": this.ticket.account_id, "is_force_time_on_closing_tickets": this.config.current.is_force_time_on_closing_tickets && isClose });
     myModal.onDismiss(data => {
       if(data){
       this.closeTicket(true);
     }
       });
       this.nav.present(myModal);
     }

     addExpense()
     {
       let myModal = Modal.create(ExpenseCreatePage, { "number": this.ticket.number, "ticket_number": this.ticket.key, "subject": this.ticket.subject, "account_id": this.ticket.account_id });
       //myModal.onDismiss(data => {
         //    console.log(data);
         //});
         this.nav.present(myModal);
       }

       addFilesButton() {
    console.log("Function connect");
    let myModal = Modal.create(AddFilesModal);
        myModal.onDismiss(data1 => {
            //this.gotoUser(data1);
        });
        this.nav.present(myModal);
            }
     
      Escalate(is_escalate?){

      is_escalate = is_escalate || false;
        //proof double click
     if (this.ticket.in_progress && Date.now() - this.ticket.in_progress < 1500) {return;}
     this.ticket.in_progress = Date.now();

     this.ticketProvider.escalateTicket(this.ticket.key, is_escalate).subscribe(
       data => {
         this.processDetails(data);
         this.nav.alert(this.config.current.names.ticket.s + " was " + (is_escalate ? "escalated" : "de-escalated") +" succesfully!");
       },
       error => {
         this.nav.alert(error || "Error! Try again later ...", true);
         console.log(error || 'Server error');
       }
       );
      }

       getFullapplink(ticketkey) {
         let curr = this.config.getCurrent();
         fullapplink(AppSite, ticketkey, curr.instance, curr.org);
       }

       getMailTolink(ticketkey) {
         let curr = this.config.getCurrent();
         mailtolink(ticketkey, curr.instance, curr.org);
       }

       getFullName (firstname,lastname,email,name) {
         return getFullName (firstname,lastname,email,name);
       }

       getCurrency(value) {
         return getCurrency(value);
       }

       getFileLink(file) {
         return FileUrlHelper.getFileLink(file.url, file.name);
       }

       setDate(date, showmonth?, istime?) {
         if (date){
        var time_offset = this.config.getCurrent("timezone_offset");     
        date = new Date(date.substring(0,23)+"Z");
        date = new Date(date.setTime(date.getTime() + time_offset*60*60*1000)).toJSON();
        return getDateTime(date, showmonth, istime);
    }
     return null;
       }
     }

  