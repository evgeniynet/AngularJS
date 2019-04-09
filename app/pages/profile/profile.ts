import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {forwardRef, ViewChild} from '@angular/core';
import {htmlEscape, linebreaks, addp} from '../../directives/helpers';
import {DataProvider} from '../../providers/data-provider';
import {TimeProvider} from '../../providers/providers';
import {TimelogsPage} from '../timelogs/timelogs';
import {SelectListComponent} from '../../components/select-list/select-list';
import {GravatarPipe} from '../../pipes/pipes';

@Page({
    templateUrl: 'build/pages/profile/profile.html',
    directives: [forwardRef(() => SelectListComponent)],
    pipes: [GravatarPipe],
})
export class ProfilePage {

    profile: any = {};
    queues: any = {};
    queue_id: any = {};
    queue_name: any = [];
    is_queue: any = {};
    is_queue1: boolean = false;
    is_queue2: boolean = false;
    is_queue3: boolean = false;
    date: string;
    title: string = "";
    selects: any = {};
    n: number = 3;
    working: number = 0;
    non_working_hours: number = 0;
    cachename: string;



    constructor(private nav: Nav, private config: Config, private dataProvider: DataProvider, private timeProvider: TimeProvider) {
  }


ngOnInit()
{    
    this.getProfile();
    if (this.config.current.user.is_techoradmin)
        this.getQueue();
    let recent = this.config.current.recent || {};
    if (this.config.current.user.is_techoradmin){
            var localQueres_id = localStorage.getItem('queue_id');
            var local_is_Queres = localStorage.getItem('is_queue');
            this.queue_id = localQueres_id ? localStorage.getItem('queue_id').split(", ") : [];
            this.is_queue = local_is_Queres ? localStorage.getItem('is_queue').split(", ") : [];

            this.is_queue1 = this.is_queue1 || (localStorage.getItem('is_queue1') == "true")? true : false;
            this.is_queue2 = this.is_queue2 || (localStorage.getItem('is_queue2') == "true")? true : false;
            this.is_queue3 = this.is_queue3 || (localStorage.getItem('is_queue3') == "true")? true : false;

            this.selects = {
                "queue1" : {
                    name: "Queue 1", 
                    value:  this.queue_name[0] || "Default",
                    selected: this.queue_id[0] || 0,
                    items: this.queues,
                    hidden: false,
                    is_disabled: false
                },
                "queue2" : {
                    name: "Queue 2", 
                    value:  this.queue_name[1] || "Default",
                    selected: this.queue_id[1] || 0,
                    items: this.queues,
                    hidden: false,
                    is_disabled: false
                },
                "queue3" : {
                    name: "Queue 3", 
                    value:  this.queue_name[2] || "Default",
                    selected: this.queue_id[2] || 0,
                    items: this.queues,
                    hidden: false,
                    is_disabled: false
                }
            };
        }
            if (this.config.current.is_time_tracking && this.config.current.user.is_techoradmin){
                let date = new Date().toJSON().substring(0,10);
                let account = "0";
                this.cachename = addp("time", "account", account);
                this.cachename = addp(this.cachename, "tech", this.config.current.user.user_id);
                this.cachename = addp(this.cachename, "start_date", date);
                this.cachename = addp(this.cachename, "end_date", date);
                this.countHours(this.timeProvider._dataStore[this.cachename] || []);
         }

        }


        getProfile(){
            this.dataProvider.getProfile().subscribe(
            data => {
                this.profile = data;                
                    }, 
            error => { 
                console.log(error || 'Server error');}
        ); 
        }

        getQueue(){
            this.dataProvider.getQueueList().subscribe(
                data => {
                    this.queues = data;

                    if (this.queue_id == 0) {
                        for (var i = 0; i < this.n; ++i) {
                            this.queue_id[i] = this.queues[i].id;
                            this.queue_name[i] = this.queues[i].fullname;

                        }   
                    }
                    else {
                        for (var i = 0; i < this.n; ++i) {
                            let sort = (this.queues.filter( v => this.queue_id[i] == v.id ));
                            sort.forEach(item => {
                                this.queue_name.push(item.fullname);
                            });
                        }
                        this.is_queue1 = this.is_queue[0] != "0" ? true : false;
                        this.is_queue2 = this.is_queue[1] != "0" ? true : false;
                        this.is_queue3 = this.is_queue[2] != "0" ? true : false;
                    }
                    this.selects.queue1.selected = this.queue_id[0];
                    this.selects.queue2.selected = this.queue_id[1];
                    this.selects.queue3.selected = this.queue_id[2];
                    this.selects.queue1.value = this.queue_name[0] || "Default";
                    this.selects.queue2.value = this.queue_name[1] || "Default";
                    this.selects.queue3.value = this.queue_name[2] || "Default";
                    this.filterQueues();
                },
                error => {
                    console.log(error || 'Server error');
                }
                );
        }

        filterQueues(){
            let sort = this.queues.filter( v => this.queue_id[0] != v.id && this.queue_id[1] != v.id && this.queue_id[2] != v.id);
            this.selects.queue1.items = this.selects.queue2.items = this.selects.queue3.items = sort;
        }

        countHours(data){
        let non_working_hours = 0;
        let working = 0;
        data.forEach(item => {
            working += item.hours;
                if (item.non_working_hours != -1)
                    non_working_hours += item.non_working_hours;
            });
            this.non_working_hours = non_working_hours;
            this.working = working;
        }

        saveSelect(event){
            let name = event.type;
            let queue1_id = this.selects.queue1.selected;
            let queue2_id = this.selects.queue2.selected;
            let queue3_id = this.selects.queue3.selected;    
        //change url on related lists
        switch (name) {
            case "queue1":
                this.selects.queue1.selected = this.queue_id[0] = event.id;
                this.selects.queue1.value = this.queue_name[0] = event.name;
                this.filterQueues();
            break;
            case "queue2":
                this.selects.queue2.selected = this.queue_id[1] = event.id;
                this.selects.queue2.value = this.queue_name[1] = event.name;
                this.filterQueues();
            break;
            case "queue3":
                this.selects.queue3.selected = this.queue_id[2] = event.id;
                this.selects.queue3.value = this.queue_name[2] = event.name;
                this.filterQueues();
            break;
        }
    }

    itemTapped(event) {
        let tech = { tech_id: this.config.current.user.user_id, tech_name: this.config.current.user.firstname+" "+this.config.current.user.lastname };
        this.nav.push(TimelogsPage, tech);
    }

    onSubmit(form) {

            let string_id = "";
            let string_is = "";
            for (var i = 0; i < this.n; ++i) {
                string_id += this.queue_id[i] + ", ";
            }
            string_id = string_id.slice(0,-2);
            if (this.is_queue1)
                string_is = this.queue_id[0] + ", ";
            else 
                string_is = "0, ";
            if (this.is_queue2)
                string_is += this.queue_id[1] + ", ";
            else 
                string_is += "0, ";
            if (this.is_queue3)
                string_is += this.queue_id[2] + "";
            else 
                string_is += "0";

            localStorage.setItem("queue_id", string_id);
            
            localStorage.setItem("is_queue", string_is);

            
            this.nav.alert('Profile was updated');
        }
    

}
