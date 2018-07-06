import {IONIC_DIRECTIVES, Config} from 'ionic-angular';
import {Component, Input} from '@angular/core';
import {getDateTime, getFullName} from '../../directives/helpers';
import {LinebreaksPipe, GravatarPipe, DaysoldPipe, FilesPipe} from '../../pipes/pipes';


@Component({
    selector: 'posts-list',
    templateUrl: 'build/components/posts-list/posts-list.html',
    directives: [IONIC_DIRECTIVES],
    pipes: [LinebreaksPipe, GravatarPipe, DaysoldPipe, FilesPipe],
})
export class PostsListComponent {
    @Input() posts: Array<any> = [];
    _posts : Array<any> = [];
    @Input() attachments: Array<any> = [];
    @Input() is_showlogs: boolean;
    @Input() is_first: boolean; 

     
    constructor(private config: Config) { 
    }  

    filter()
    {
        let posts = [];
        if (!this.is_showlogs)
            posts =  this.posts.filter(item => !!~["Initial Post", "Response", "Closed", "ReOpened"].indexOf(item.log_type));
        else
            posts = this.posts;
        this._posts = this.is_first ? [posts[0]] : posts.slice(1);
    }

    ngOnInit() {
      this.filter();
    }

    ngOnChanges(event) {
        if ("is_showlogs" in event)
            {
                this.filter();
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

    getTime (date){
        let hours= this.config.getCurrent("timezone_offset");
    if (date){
        if (date.length == 19)
            date = date.slice(0,-3);
        let temp = new Date(date);
        return new Date(temp.setTime(temp.getTime() + (hours*60*60*1000))).toJSON();
    }
    return date;
}


    setDate(date, showmonth?, istime?) {
         return date ? getDateTime(date, showmonth, istime) : null;
       }

    /*get posts()
    {
        return this.posts.filter(item => item.id.indexOf(args[0]) !== -1);
    }
    */
}
