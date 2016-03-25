import {Page, Config, NavController, NavParams, ViewController} from 'ionic-framework/ionic';
import {forwardRef} from 'angular2/core';
import {DataProvider} from '../../providers/data-provider';
import {ClassListComponent} from '../../components/class-list/class-list';
import {SelectListComponent} from '../../components/select-list/select-list';

@Page({
  templateUrl: 'build/pages/timelog/timelog.html',
    directives: [ClassListComponent, forwardRef(() => SelectListComponent)],
})
export class TimelogPage {
    constructor(nav: NavController, navParams: NavParams, dataProvider: DataProvider, config: Config, private view: ViewController) {
    this.nav = nav;
        this.config = config;
        this.dataProvider = dataProvider;
        this.navParams = navParams;
        this.time = this.navParams.data;
  }
    
    onPageLoaded()
    {
        /*this.dataProvider.getTimelogs().subscribe(
            data => {this.timelogs = data;
                     console.log(data);}, 
            error => { 
                console.log(error || 'Server error');}
        );*/
    }
    
     setDate(date) {
      return new Date(date);
  }
    
    close() {
        this.view.dismiss();
    }
}
