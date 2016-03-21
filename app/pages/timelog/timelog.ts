import {Page, Config, NavController} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
//import {TicketsListComponent} from '../../components/tickets-list/tickets-list';

@Page({
  templateUrl: 'build/pages/timelog/timelog.html',
    //directives: [ActionButtonComponent],
})
export class TimelogPage {
    constructor(nav: NavController, dataProvider: DataProvider, config: Config) {
    this.nav = nav;
        this.config = config;
        this.dataProvider = dataProvider;
  }
    
    onPageLoaded()
    {
        let pager = {limit: 50};

        /*this.dataProvider.getTimelogs(pager).subscribe(
            data => {this.timelogs = data;
                     console.log(data);}, 
            error => { 
                console.log(error || 'Server error');}
        );*/
    }
    
     setDate(date) {
      return new Date(date);
  }
}
