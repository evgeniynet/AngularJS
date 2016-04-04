import {Page, Config, NavController, NavParams, ViewController} from 'ionic-angular';
import {forwardRef} from 'angular2/core';
import {DataProvider} from '../../providers/data-provider';
import {ClassListComponent} from '../../components/class-list/class-list';
import {SelectListComponent} from '../../components/select-list/select-list';
import {Observable} from 'rxjs/Observable';
//TODO remove all operators
import 'rxjs/Rx';
/*import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/next';
*/
@Page({
  templateUrl: 'build/pages/timelog/timelog.html',
    directives: [ClassListComponent, forwardRef(() => SelectListComponent)],
})
export class TimelogPage {
    constructor(private nav: NavController, private navParams: NavParams, private dataProvider: DataProvider, private config: Config, private view: ViewController) {
    }
    
    onPageLoaded()
    {
        this.isbillable = true;
        this.time = (this.navParams || {}).data || {};

        const decrementCounter$ = Observable.create(observer => {
            this.decrement = () => { observer.next(); };
        });
        const incrementCounter$ = Observable.create(observer => {
            this.increment = () => { observer.next(); };
        });

        const inc = this.config.current.time_hour_increment > 0 ? this.config.current.time_hour_increment : 0.25;
        const neg_inc = -Math.abs(inc);


        // set up the intent
        const intent$ = Observable.merge(
            decrementCounter$.map(() => (neg_inc)),
            incrementCounter$.map(() => inc)
        );

        // declare how the intent is transformed into a model
        this.count = intent$
            .startWith(this.time.hours || 0)
            .scan((currentCount, value) => {
                let val = currentCount + value;
                return val > 0 ? val : 0;
            });

        /*this.dataProvider.getTimelogs().subscribe(
            data => {this.timelogs = data;
                     console.log(data);}, 
            error => { 
                console.log(error || 'Server error');}
        );*/
        
        this.he = this.config.current.user;

        let account_id = this.time.account_id || this.he.account_id || -1;
        let project_id = this.time.project_id || 0;

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
                selected: project_id,
                url: `projects?account=${account_id}&is_with_statistics=false`,
                hidden: false
            },
            "ticket" : {
                name: "Ticket", 
                value: this.time.ticket_number ? `#${this.time.ticket_number} : ${this.time.ticket_subject}` : "Choose Ticket",
                selected: this.time.ticket_number || 0,
                url: `tickets?status=open&account=${account_id}&project=${project_id}`,
                hidden: this.time.is_project_log || false
            },
            "tasktype" : {
                name: "Task Type", 
                value: this.task_type || "Default",
                selected: this.time.task_type_id || 0,
                url: `task_types?account=${account_id}&project=${project_id}`,
                hidden: false
            }
        };

        //{ "ticket" : localStorage.getItem('ticketNumber') } 
        //{ "account" : account, "project": project } 
        //edat = JSON.stringify(new Date(dat2));
        //userMessage.showMessage(false, "Oops not enough time");
        /*
        getApi('time' + (isEdit ? "/" + timeLog.time_id : ""),{
                        "tech_id" : isEdit ? timeLog.user_id : tech,
                        "project_id": projectId,
                        "is_project_log": !ticket_id,
                        "ticket_key": ticket_id,
                        "account_id" : accountId,
                        "note_text": note,
                        "task_type_id":taskId,
                        "hours":time,
                        "is_billable": isBillable,
                        "date": dat1 ? sdat: "",
                        "start_date": dat1 ? sdat : "",
                        "stop_date": dat2 ? edat : ""
                    }, isEdit ? 'PUT' : 'POST').then(function (d) {
                        localStorage.setItem('isMessage','truePos');
                        localStorage.setItem('userMessage','Time was successfully added <i class="ion-thumbsup"></i>');
                        backFunction();
                    }
                    */
             
    }
    
    saveSelect(event){
        let name = event.type;
        let account_id = this.selects.account.selected;
        //change url on related lists
        switch (name) {
            case "account":
                if (this.selects.account.selected === event.id) {
                    break;
                }
                this.selects.project.url = `projects?account=${event.id}&is_with_statistics=false`;
                this.selects.project.value = "Default";
                this.selects.project.selected = 0;
                account_id = event.id;
                this.selects.ticket.hidden = false;
                this.selects.project.hidden = false;
            case "project" :
                if (this.selects.project.selected === event.id)
                {
                    break;
                }
                this.selects.ticket.hidden = false;
                this.selects.ticket.url = `tickets?status=open&account=${account_id}&project=${event.id}`,
                this.selects.ticket.value = "Default";
                this.selects.ticket.selected = 0;
                this.selects.tasktype.url = `task_types?account=${account_id}&project=${event.id}`,
                this.selects.tasktype.value = "Default";
                this.selects.tasktype.selected = 0;
                break;
        }
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
    }

     setDate(date) {
      return date ? new Date(date) : null;
  }
    
    close() {
        this.view.dismiss();
    }
}
