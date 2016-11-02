import {IONIC_DIRECTIVES} from 'ionic-angular';
import {Component, Input} from '@angular/core';
import {getDateTime, getFullName} from '../../directives/helpers';
import {GravatarPipe, DaysoldPipe, FilesPipe} from '../../pipes/pipes';


@Component({
    selector: 'posts-list',
    templateUrl: 'build/components/posts-list/posts-list.html',
    directives: [IONIC_DIRECTIVES],
    pipes: [GravatarPipe, DaysoldPipe, FilesPipe],
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
        if (this.posts.length > 1 && !this.is_showlogs)
            this._posts =  this.posts.filter(item => !!~["Initial Post", "Response", "Closed", "ReOpened"].indexOf(item.log_type));
        else
            this._posts = this.posts;
    }

    ngOnInit() {
      this.filter();
    }

    ngOnChanges(event) {
        if ("is_showlogs" in event)
            {
                if (this.posts.length > 1)
                {
                    this.filter();
                }
                return;
            } 
        if ("posts" in event) {        
             if ("posts" in event  && (event.posts.isFirstChange() || (event.posts.currentValue[0] || {}).id == (event.posts.previousValue[0] || {}).id))
                 return;
             this.filter();
          }

        //if ("attachments" in event && !event.posts.isFirstChange() && this.posts.length == 1 && (event.attachments.currentValue || []).length > (event.attachments.previousValue || []).length)
        //   this.filter(); 
    }

    /*get posts()
    {
        return this.posts.filter(item => item.id.indexOf(args[0]) !== -1);
    }
    */
}
