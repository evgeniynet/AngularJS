import {IONIC_DIRECTIVES} from 'ionic/ionic';
import {Component, Input} from 'angular2/core';
//import {TicketDetailsPage} from '../../pages/ticket-details/ticket-details';
import {GravatarPipe} from '../../pipes/gravatar';
import {LinebreaksPipe} from '../../pipes/linebreaks';


@Component({
    selector: 'posts-list',
    templateUrl: 'build/components/posts-list/posts-list.html',
    directives: [IONIC_DIRECTIVES],
    pipes: [GravatarPipe, LinebreaksPipe],
})
export class PostsListComponent {
    @Input() posts: Array;
     
    constructor() {
        this.posts = [];
    }  
}
