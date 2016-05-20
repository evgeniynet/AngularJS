import {IONIC_DIRECTIVES} from 'ionic-angular';
import {Component, Input} from '@angular/core';
//import {TicketDetailsPage} from '../../pages/ticket-details/ticket-details';
import {getDateTime, getFullName} from '../../directives/helpers';
import {GravatarPipe, LinebreaksPipe, DaysoldPipe, FilesPipe} from '../../pipes/pipes';


@Component({
    selector: 'posts-list',
    templateUrl: 'build/components/posts-list/posts-list.html',
    directives: [IONIC_DIRECTIVES],
    pipes: [GravatarPipe, LinebreaksPipe, DaysoldPipe, FilesPipe],
})
export class PostsListComponent {
    @Input() posts: Array<any>;
    @Input() attachments: Array<any>;

     
    constructor() {
        this.posts = [];
        this.attachments = [];
    }  
     
getFullName (firstname,lastname,email,name) {
    return getFullName (firstname,lastname,email,name);
}
  
    setDate(date, showmonth?, istime?) {
        return date ? getDateTime(date, showmonth, istime) : null;
    }
}
