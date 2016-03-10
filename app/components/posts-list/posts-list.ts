import {IONIC_DIRECTIVES} from 'ionic-framework/ionic';
import {Component, Input} from 'angular2/core';
//import {TicketDetailsPage} from '../../pages/ticket-details/ticket-details';
import {getFullName} from '../../directives/helpers';
import {GravatarPipe, LinebreaksPipe, DaysoldPipe, FilesPipe} from '../../pipes/pipes';


@Component({
    selector: 'posts-list',
    templateUrl: 'build/components/posts-list/posts-list.html',
    directives: [IONIC_DIRECTIVES],
    pipes: [GravatarPipe, LinebreaksPipe, DaysoldPipe, FilesPipe],
})
export class PostsListComponent {
    @Input() posts: Array;
    @Input() attachments: Array;
     
    constructor() {
        this.posts = [];
        this.attachments = [];
    }  
     
getFullName (firstname,lastname,email,name) {
    return getFullName (firstname,lastname,email,name);
}
  
     setDate(date) {
      return new Date(date);
  }
}
