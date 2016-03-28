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
        
         let he = this.config.current.user;
        this.details_tab = "Reply";
        let data = (this.navParams || {}).data || {};
        let account_id = -1;
        
        this.selects = {
            "location" : {
                name: "Location", 
                value: data.location_name,
                selected: data.location_id,
                url: `locations?account=${account_id}`,
                hidden: false
            },
            "tech" : {
                name: "Tech", 
                value: getFullName(data.technician_firstname || data.tech_firstname, data.technician_lastname || data.tech_lastname,  data.technician_email || data.tech_email),
                selected: data.tech_id,
                url: "technicians",
                hidden: false
            },
            "project" : {
                name: "Project", 
                value: data.project_name,
                selected: data.project_id,
                url: `projects?account=${account_id}&is_with_statistics=false`,
                hidden: false
            },
            "level" : {
                name: "Level", 
                value: data.level+ " - " +data.level_name,
                selected: data.level,
                url: "levels",
                hidden: false
            },
            "priority" : {
                name: "Project", 
                value: data.priority + " - " + data.priority_name,
                selected: data.priority_id,
                url: "priorities",
                hidden: false
            },
            "class" : {
                name: "Class", 
                value: data.class_name,
                selected: data.class_id,
                url: "classes",
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
