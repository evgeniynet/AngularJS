import {Page, Config, NavController} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {TimelogPage} from '../timelog/timelog';
import {ActionButtonComponent} from '../../components/action-button/action-button';
import {GravatarPipe, MorePipe, LinebreaksPipe} from '../../pipes/pipes';

@Page({
  templateUrl: 'build/pages/timelogs/timelogs.html',
    directives: [ActionButtonComponent],
    pipes: [GravatarPipe, MorePipe, LinebreaksPipe],
})
export class TimelogsPage {
    constructor(nav: NavController, dataProvider: DataProvider, config: Config) {
    this.nav = nav;
        this.is_empty = false;
        this.dataProvider = dataProvider;
  }
    
    onPageLoaded()
    {
        let pager = {limit: 25};

        this.dataProvider.getTimelogs(pager).subscribe(
            data => {
                this.timelogs = data;
                this.is_empty = !data || data.length == 0;
            }, 
            error => { 
                console.log(error || 'Server error');}
        );
    }
    
    itemTapped(time) {
        this.nav.push(TimelogPage, time);
    }
    
    setDate(date) {
        return date ? new Date(date) : null;
    }
}
