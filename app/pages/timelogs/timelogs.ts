import {Page, Config, NavController} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
import {TimelogPage} from '../timelog/timelog';
import {ActionButtonComponent} from '../../components/action-button/action-button';
import {MorePipe} from '../../pipes/pipes';

@Page({
  templateUrl: 'build/pages/timelogs/timelogs.html',
    directives: [ActionButtonComponent],
    pipes: [MorePipe],
})
export class TimelogsPage {
    constructor(nav: NavController, dataProvider: DataProvider, config: Config) {
    this.nav = nav;
        this.timelogs = null;
        this.dataProvider = dataProvider;
        let pager = {limit: 5};

        this.dataProvider.getTimelogs(pager).subscribe(
            data => {
                this.timelogs = data;
                    }, 
            error => { 
                console.log(error || 'Server error');}
        );
  }
    itemTapped() {this.nav.push(TimelogPage);}
    
     setDate(date) {
      return new Date(date);
  }
}
