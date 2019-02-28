import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {forwardRef, ViewChild} from '@angular/core';
import {htmlEscape, linebreaks} from '../../directives/helpers';
import {DataProvider} from '../../providers/data-provider';
import {SelectListComponent} from '../../components/select-list/select-list';

@Page({
    templateUrl: 'build/pages/profile/profile.html',
    directives: [forwardRef(() => SelectListComponent)],
})
export class ProfilePage {

    profile: any = {};
    is_queue1: boolean = true;
    is_queue2: boolean = true;
    is_queue3: boolean = true;
    date: string;
    title: string = "";
    selects: any = {};




    constructor(private nav: Nav, private config: Config, private dataProvider: DataProvider) {
  }


ngOnInit()
{    
    this.getProfile();
    let recent = this.config.current.recent || {};
    
            let queue1_id = this.profile.queue1_id || 0;
            let queue2_id = this.profile.queue2_id || 0;
            let queue3_id = this.profile.queue3_id || 0;

            this.selects = {
                "queue1" : {
                    name: "queue1", 
                    value:  this.profile.queue1_name || "Default",
                    selected: queue1_id,
                    url: "queues?sort_by=tickets_count",
                    hidden: false,
                    is_disabled: false
                },
                "queue2" : {
                    name: "queue2", 
                    value:  this.profile.queue2_name || "Default",
                    selected: queue2_id,
                    url: "queues?sort_by=tickets_count",
                    hidden: false,
                    is_disabled: false
                },
                "queue3" : {
                    name: "queue3", 
                    value:  this.profile.queue3_name || "Default",
                    selected: queue3_id,
                    url: "queues?sort_by=tickets_count",
                    hidden: false,
                    is_disabled: false
                }
            };
        }

        getProfile(){
            this.dataProvider.getProfile().subscribe(
            data => {
                this.profile = data;
                console.log(this.profile);
                    }, 
            error => { 
                console.log(error || 'Server error');}
        ); 
        }

        saveSelect(event){
            let name = event.type;
            console.log(name);
            let queue1_id = this.selects.queue1.selected;
            let queue2_id = this.selects.queue2.selected;
            let queue3_id = this.selects.queue3.selected;    
        //change url on related lists
        switch (name) {
            case "queue1":
            if (this.selects.queue1.selected === event.id) {
                break;
            }
            if (event.id == this.selects.queue2.selected || event.id == this.selects.queue3.selected){
                this.selects.queue1.selected = 0;
                this.selects.queue1.value = "Default";
                this.nav.alert("Please choose anoter queue. It is already selected!", true);
            }
            else{
                this.selects.queue1.selected = event.id;
                this.selects.queue1.value = event.fullname || "Default";
            }
            break;
            case "queue2":
            if (this.selects.queue2.selected === event.id) {
                break;
            }
            if (event.id == this.selects.queue1.selected || event.id == this.selects.queue3.selected){
                this.selects.queue2.selected = 0;
                this.selects.queue2.value = "Default";
                this.nav.alert("Please choose anoter queue. It is already selected!", true);
            }
            else{
                this.selects.queue2.selected = event.id;
                this.selects.queue2.value = event.fullname || "Default";
            }
            break;
            case "queue3":
            if (this.selects.queue3.selected === event.id) {
                break;
            }
            if (event.id == this.selects.queue1.selected || event.id == this.selects.queue3.selected){
                this.selects.queue3.selected = 0;
                this.selects.queue3.value = "Default";
                this.nav.alert("Please choose anoter queue. It is selected!", true);
            }
            else{
                this.selects.queue3.selected = event.id;
                this.selects.queue3.value = event.fullname || "Default";
            }
            break;
        }
    }

    onSubmit(form) {

            //TODO if other user changes what id should I write?  
            let data = {
                "queue1": this.selects.queue1.selected,
                "queue2": this.selects.queue2.selected,
                "queue3": this.selects.queue3.selected,
                "is_queue1": !this.is_queue1,
                "is_queue2": !this.is_queue2,
                "is_queue3": !this.is_queue3,
            };

            this.timeProvider.addTime(this.time.time_id, data, isEdit ? "PUT" : "POST").subscribe(
                res => {
                    //store recent
                    if (!this.time.number && !this.time.time_id && !(this.time.account || {}).id)
                    {
                        this.config.setRecent({"account": this.selects.account,
                                               "project": this.selects.project,
                                               "tasktype": this.selects.tasktype,
                                               "contract": this.selects.contract,
                                                "prepaidpack": this.selects.prepaidpack});
                    }
                    if (isEdit){
                        this.time.start_time = this.AddHours(data.start_date, -1*this.UserDateOffset);
                        this.time.stop_time = this.AddHours(data.stop_date, -1*this.UserDateOffset);
                        this.time.hours = data.hours;
                        this.time.non_working_hours = data.non_working_hours;
                        this.time.no_invoice = data.no_invoice;
                        this.time.is_taxable = data.is_taxable;
                    }
                    else
                    {
                        var tdate = data.date || this.GetLocalDate();
                        var tt = {
                            time_id:0,
                            account_id:data.account_id,
                            account_name:this.selects.account.value,
                            no_invoice:data.no_invoice,
                            is_taxable : data.is_taxable,
                            date:tdate,
                            hours:data.hours,
                            non_working_hours:data.non_working_hours,
                            is_project_log:data.is_project_log,
                            note:data.note_text,
                            project_id:data.project_id,
                            project_name:this.selects.project.value,
                            start_time: this.AddHours(data.start_date, -1*this.UserDateOffset),
                            stop_time: this.AddHours(data.stop_date, -1*this.UserDateOffset),
                            time_offset:this.UserDateOffset,
                            task_type:this.selects.tasktype.value,
                            task_type_id:data.task_type_id,
                            contract_name:this.selects.contract.value,
                            contract_id:data.contract_id,
                            prepaid_pack:this.selects.prepaidpack.value,
                            prepaid_pack_id:data.prepaid_pack_id,
                            ticket_number:data.ticket_key,
                            ticket_subject:this.selects.ticket.value,
                            user_email:this.he.email,
                            user_id:this.he.user_id,
                            user_name :this.he.firstname + " " + this.he.lastname};
                            let date = new Date().toJSON().substring(0,10);
                            this.timeProvider.getTimelogs("0", this.config.current.user.user_id, { "limit": 25 }, date, date);
                            (this.timeProvider._dataStore[this.time.cachename] || []).splice(0, 0, tt);
                        }
                        this.nav.alert('Time was successfully ' + (isEdit ? 'updated' : 'added') + ' :)');
                        this.close(tt);
                        this.resetTimer();
                    },
                    error => {
                        console.log(error || 'Server error');
                    }
                    );
        }
    

}
