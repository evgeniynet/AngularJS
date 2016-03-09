import {IONIC_DIRECTIVES} from 'ionic-framework/ionic';
import {Component, Input} from 'angular2/core';
//import {TicketDetailsPage} from '../../pages/ticket-details/ticket-details';
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
     
  get Anotherdate(){ 
    return this.abc 
  }
  setDate(date) {
    this.Anotherdate = date;
    return this.Anotherdate;
  }
  set Anotherdate(date){ 
    this.abc = new Date(date)
  }
}
