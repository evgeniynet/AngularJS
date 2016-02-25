import {Page, NavController, NavParams} from 'ionic/ionic';
import {DataProvider} from '../../providers/data-provider';
import {PostsListComponent} from '../../components/posts-list/posts-list';
import {GravatarPipe, LinebreaksPipe} from '../../pipes/pipes';

@Page({
  templateUrl: 'build/pages/ticket-details/ticket-details.html',
    directives: [PostsListComponent],
    pipes: [GravatarPipe, LinebreaksPipe],
})
export class TicketDetailsPage {
    constructor(nav: NavController, navParams: NavParams, dataProvider: DataProvider) {
        this.nav = nav;
        this.details_tab = "Reply";
        this.navParams = navParams;
        this.dataProvider = dataProvider;
        this.ticket = this.navParams.data || {};
        this.details = {};
        this.posts = [];
        this.post1=[];
         this.dataProvider.getTicketDetails(this.ticket.key).subscribe(
             data => {this.details = data;
                      this.post1 = [data.ticketlogs.shift()];
                      this.posts = data.ticketlogs;}, 
            error => { 
                console.log(error || 'Server error');}
        ); 
    }
}
