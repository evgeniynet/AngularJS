import {Page, Config, NavController, NavParams, Modal} from 'ionic-angular';
import {FORM_DIRECTIVES, Validators} from 'angular2/common';
import {DataProvider} from '../../providers/data-provider';
import {htmlEscape, getCurrency, getFullName, fullapplink} from '../../directives/helpers';
import {PostsListComponent} from '../../components/posts-list/posts-list';
import {SelectListComponent} from '../../components/select-list/select-list';
import {ClassListComponent} from '../../components/class-list/class-list';
import {CloseTicketModal} from '../../pages/modals/modals';
import {GravatarPipe, LinebreaksPipe, DaysoldPipe} from '../../pipes/pipes';

@Page({
    templateUrl: 'build/pages/ticket-details/ticket-details.html',
    directives: [PostsListComponent, SelectListComponent, ClassListComponent],
    pipes: [GravatarPipe, LinebreaksPipe, DaysoldPipe],
})
export class TicketDetailsPage {
    constructor(private nav: NavController, private navParams: NavParams, private dataProvider: DataProvider, private config: Config) {
        this.ticket = {};
        this.posts = [];
    }

    onPageWillEnter() {
        this.active = true;
        let he = this.config.current.user;
        this.details_tab = "Reply";
        let data = (this.navParams || {}).data || {};
        let account_id = -1;
        this.selects = {
            "location": {
                name: "Location",
                value: data.location_name || "( Not Set )",
                selected: data.location_id,
                url: `locations?account=${account_id}`,
                hidden: false
            },
            "tech": {
                name: "Tech",
                value: getFullName(data.technician_firstname || data.tech_firstname, data.technician_lastname || data.tech_lastname, data.technician_email || data.tech_email),
                selected: data.tech_id,
                url: "technicians",
                hidden: false
            },
            "project": {
                name: "Project",
                value: data.project_name || "( Not Set )",
                selected: data.project_id,
                url: `projects?account=${account_id}&is_with_statistics=false`,
                hidden: false
            },
            "level": {
                name: "Level",
                value: data.level_name ? (data.level + " - " + data.level_name) : "( Not Set )",
                selected: data.level,
                url: "levels",
                hidden: false
            },
            "priority": {
                name: "Priority",
                value: data.priority_name ? (data.priority + " - " + data.priority_name) : "( Not Set )",
                selected: data.priority_id,
                url: "priorities",
                hidden: false
            },
            "class": {
                name: "Class",
                value: data.class_name || "( Not Set )",
                selected: data.class_id,
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
            this.dataProvider.getTicketDetails(key).subscribe(
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

    processDetails(data, isShortInfo)
    {
        if (!isShortInfo && (!data || !data.ticketlogs || data.ticketlogs == 0))
        { 
            this.redirectOnEmpty();
            return;
        }
        
        this.ticket = data;
        
        if (!isShortInfo)
        {
            this.attachments = data.attachments;
            this.posts = data.ticketlogs;
        }
    }

    redirectOnEmpty(){
        this.alert.error('Incorrect ticket. Going back...', 'Oops!');

        setTimeout(() => {
            this.nav.pop();
        }, 3000);
    }

    saveSelect(event){
        let name = event.type;
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
    }
    
    onSubmit(form) {
        if (form.valid) {
            var post = htmlEscape(this.ticketnote.trim()).substr(0, 5000);

            this.dataProvider.addTicketPost(this.ticket.id, post).subscribe(
                data => {
                    this.alert.success("", 'Note added :)');
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

    closeTicket()
    {
        let myModal = Modal.create(CloseTicketModal, { "number": this.ticket.number, "key": this.ticket.key, "subject": this.ticket.subject });
        myModal.onDismiss(data => {
            console.log(data);
        });
        setTimeout(() => {
            this.nav.present(myModal);
        }, 500);
    }

    getFullapplink(ticketkey) {
        return fullapplink("site", ticketkey, this.config.current.instance, this.config.current.org);
    }
    
    getFullName (firstname,lastname,email,name) {
        return getFullName (firstname,lastname,email,name);
    }

    getCurrency(value) {
        return getCurrency(value, this.config.current.currency);
    }

    setDate(date) {
        return date ? new Date(date) : null;
    }

}
