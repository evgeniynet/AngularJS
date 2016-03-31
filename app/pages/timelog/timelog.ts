import {Page, Config, NavController, NavParams, ViewController} from 'ionic-angular';
import {forwardRef} from 'angular2/core';
import {DataProvider} from '../../providers/data-provider';
import {ClassListComponent} from '../../components/class-list/class-list';
import {SelectListComponent} from '../../components/select-list/select-list';

@Page({
  templateUrl: 'build/pages/timelog/timelog.html',
    directives: [ClassListComponent, forwardRef(() => SelectListComponent)],
})
export class TimelogPage {
    constructor(private nav: NavController, private navParams: NavParams, private dataProvider: DataProvider, private config: Config, private view: ViewController) {
      
      }
    
    onPageLoaded()
    {
        this.time = (this.navParams || {}).data || {};
        /*this.dataProvider.getTimelogs().subscribe(
            data => {this.timelogs = data;
                     console.log(data);}, 
            error => { 
                console.log(error || 'Server error');}
        );*/
        
        this.he = this.config.current.user;

        let account_id = this.time.account_id || this.he.account_id || -1;

        this.selects = {
            "account" : {
                name: "Account", 
                value: (this.time.account || {}).name || this.he.account_name,
                selected: account_id,
                url: "accounts?is_with_statistics=false",
                hidden: false
            },
            "project" : {
                name: "Project", 
                value: this.time.project_name || "Default",
                selected: this.time.project_id || 0,
                url: `projects?account=${account_id}&is_with_statistics=false`,
                hidden: false
            },
            "ticket" : {
                name: "Ticket", 
                value: this.time.project_name,
                selected: this.time.ticket_number,
                url: `projects?account=${account_id}&is_with_statistics=false`,
                hidden: false
            },
            "type" : {
                name: "Task Type", 
                value: this.time.class_name,
                selected: this.time.task_type_id,
                url: "task_types",
                hidden: false
            }
        };
        
    }
    
     setDate(date) {
      return new Date(date);
  }
    
    close() {
        this.view.dismiss();
    }
}
