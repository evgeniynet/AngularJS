import {Page, Config, Nav, NavParams, Modal} from 'ionic-angular';
import {FORM_DIRECTIVES, Validators} from '@angular/common';
import {AppSite} from '../../providers/config';
import {TicketProvider} from '../../providers/ticket-provider';
import {getDateTime, htmlEscape, getCurrency, getFullName, fullapplink, parseXml, FileUrlHelper} from '../../directives/helpers';
import {PostsListComponent} from '../../components/posts-list/posts-list';
import {SelectListComponent} from '../../components/select-list/select-list';
import {ClassListComponent} from '../../components/class-list/class-list';
import {CloseTicketModal} from '../../pages/modals/modals';
import {TimelogPage} from '../../pages/timelog/timelog'; 
import {ExpenseCreatePage} from '../../pages/expense-create/expense-create';
import {GravatarPipe, LinebreaksPipe, DaysoldPipe} from '../../pipes/pipes';

@Page({
    templateUrl: 'build/pages/ticket-details/ticket-details.html',
    directives: [PostsListComponent, SelectListComponent, ClassListComponent],
    pipes: [GravatarPipe, LinebreaksPipe, DaysoldPipe],
})
export class TicketDetailsPage {
    
    counts: any;
    ticket: any;
    posts: any;
    details_tab: string;
    active: boolean;
    he: any;
    techname: string;
    selects: any;
    ticketnote: string;
    attachments: any;

    constructor(private nav: Nav, private navParams: NavParams, private ticketProvider: TicketProvider, private config: Config) {
        this.ticket = {};
        this.ticket.customfields = [];
        this.posts = [
            {
                "id": 0,
                "ticket_key": "",
                "user_id": 0,
                "user_email": " ",
                "user_firstname": " ",
                "user_lastname": " ",
                "record_date": "2016-01-01T00:00:00.0000000",
                "log_type": " ",
                "note": " ",
                "ticket_time_id": 0,
                "sent_to": " ",
                "is_waiting": false,
                "sla_used": 0
            }];
    }

    onPageLoaded() {
        this.active = true;
        this.he = this.config.getCurrent("user");
        this.details_tab = "Reply";
        let data = this.navParams.data || {};
        let account_id = -1;
        this.techname = getFullName(data.technician_firstname || data.tech_firstname, data.technician_lastname || data.tech_lastname, data.technician_email || data.tech_email);
        this.selects = {
            "location": {
                name: "Location",
                value: data.location_name || "( Not Set )",
                selected: data.location_id || 0,
                url: `locations?account=${account_id}`,
                hidden: false
            },
            "tech": {
                name: "Tech",
                value: this.techname,
                selected: data.tech_id,
                url: "technicians",
                hidden: false
            },
            "technician": {
                name: "Technician",
                value: "Transfer Ticket",
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

        this.ticketnote = "";
        
        let isFullInfo = (data.ticketlogs && data.ticketlogs.length > 0);

        this.getPosts(data.key, !isFullInfo);

        this.processDetails(data, !isFullInfo);
    }

    getPosts(key, isShortInfo)
    {
        if (isShortInfo) {
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
    }

    processDetails(data, isShortInfo?)
    {
        if (!isShortInfo && (!data || !data.ticketlogs || data.ticketlogs == 0))
        { 
            this.redirectOnEmpty();
            return;
        }
        
        this.ticket = data;
        this.ticket.customfields = [];
        
        if (!isShortInfo)
        {
            this.attachments = (data.attachments || []).slice().reverse();
            this.posts = data.ticketlogs;

            let xml = parseXml(this.ticket.customfields_xml);
            if (xml)
            {
                let t=[];
                for (var n = xml.documentElement.firstChild; n; n = n.nextSibling)
                { 
                   t.push({ "id": n.attributes[0].nodeValue, "name": n.firstChild.innerHTML, "value": n.firstChild.nextSibling.innerHTML || ""}); 
                }
                this.ticket.customfields = t;
            }
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
    }
    
    onSubmit(form) {
        if (form.valid) {
            var post = htmlEscape(this.ticketnote.trim()).substr(0, 5000);

            this.ticketProvider.addTicketPost(this.ticket.id, post).subscribe(
                data => {
                    this.nav.alert('Note added :)');
                    this.ticketnote = "";
                    this.active = false;
                    setTimeout(() => this.active = true, 0);
                    this.getPosts(this.ticket.key, true);
                },
                error => {
                    console.log(error || 'Server error');
                }
                );
        }
    }

    onUpdate() {
        let data = {
            "class_id": this.selects.class.selected,
            "level_id": this.selects.level.selected,
            "priority_id": this.selects.priority.selected,
            "project_id": this.selects.project.selected,
            "location_id": this.selects.location.selected,
            "account_id": this.ticket.account_id,
            "tech_id": this.selects.tech.selected
        };

        this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(
            data => {
                this.nav.alert('Ticket was successfully updated :)');
                this.getPosts(this.ticket.key, true);
            },
            error => {
                console.log(error || 'Server error');
            }
            );
    }

    transferTicket(event) {
        if (!event)
            return;
        let techid = event.id;
        this.selects.technician.selected = techid;
        this.selects.technician.value = "Transfer Ticket";

        let data = {
            "tech_id": techid
        };

        this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(
            data => {
                this.nav.alert('Ticket has been transferred :)');
                this.techname = this.selects.tech.value = this.ticket.tech_firstname = event.name;
                this.ticket.tech_lastname = this.ticket.tech_email = "";
                this.selects.tech.selected = techid;
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

        this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(
            data => {
                this.nav.alert('Ticket pickup was Succesfull!');
                this.techname = this.selects.tech.value = this.ticket.tech_firstname = getFullName(this.he.firstname, this.he.lastname, this.he.email);
                this.ticket.tech_lastname = this.ticket.tech_email = "";
                this.selects.tech.selected = this.he.user_id;
            },
            error => {
                console.log(error || 'Server error');
            }
            );
    }


    closeTicket()
    {
        let myModal = Modal.create(CloseTicketModal, { "number": this.ticket.number, "key": this.ticket.key, "subject": this.ticket.subject });
        //myModal.onDismiss(data => {
        //    console.log(data);
        //});
        this.nav.present(myModal);
    }   

    addTime()
    {
        let myModal = Modal.create(TimelogPage, { "number": this.ticket.number, "ticket_number": this.ticket.key, "subject": this.ticket.subject, "account_id": this.ticket.account_id });
        //myModal.onDismiss(data => {
        //    console.log(data);
        //});
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

    getFullapplink(ticketkey) {
        let curr = this.config.getCurrent();
        fullapplink(AppSite, ticketkey, curr.instance, curr.org);
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
        return date ? getDateTime(date, showmonth, istime) : null;
    }
}
