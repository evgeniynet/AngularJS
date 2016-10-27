import {IONIC_DIRECTIVES} from 'ionic-angular';
import {Component, Input} from '@angular/core';
import {getDateTime, getFullName} from '../../directives/helpers';
import {GravatarPipe, LinebreaksPipe, DaysoldPipe, FilesPipe} from '../../pipes/pipes';


@Component({
    selector: 'posts-list',
    templateUrl: 'build/components/posts-list/posts-list.html',
    directives: [IONIC_DIRECTIVES],
    pipes: [GravatarPipe, LinebreaksPipe, DaysoldPipe, FilesPipe],
})
export class PostsListComponent {
    @Input() posts: Array<any> = [];
    _posts : Array<any> = [];
    @Input() attachments: Array<any> = [];
    @Input() is_showlogs: boolean;

     
    constructor() {
    }  

    filter()
    {
        this._posts = this.is_showlogs ? this.posts : this.posts.filter(item => !!~["Initial Post", "Response", "Closed", "ReOpened"].indexOf(item.log_type));
    }

    ngOnInit() {
      this.filter();
    }

    ngOnChanges(event) { 
        if ("posts" in event || "is_showlogs" in event) {
             if (event.posts.isFirstChange() && event.posts.currentValue !== null)
                 return;
             this.filter();
          }
    }

    /*get posts()
    {
        return this.posts.filter(item => item.id.indexOf(args[0]) !== -1);
    }
    */
}
