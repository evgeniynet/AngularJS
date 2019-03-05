import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {forwardRef, ViewChild} from '@angular/core';
import {htmlEscape, linebreaks} from '../../directives/helpers';
import {DataProvider} from '../../providers/data-provider';
import {SelectListComponent} from '../../components/select-list/select-list';
import {GravatarPipe} from '../../pipes/pipes';

@Page({
    templateUrl: 'build/pages/profile/profile.html',
    directives: [forwardRef(() => SelectListComponent)],
    pipes: [GravatarPipe],
})
export class ProfilePage {

    profile: any = {};
    is_queue1: boolean = true;
    is_queue2: boolean = false;
    is_queue3: boolean = false;
    date: string;
    title: string = "";
    selects: any = {};




    constructor(private nav: Nav, private config: Config, private dataProvider: DataProvider) {
  }


ngOnInit()
{    
    this.getProfile();
    let recent = this.config.current.recent || {};
    
            let queue1_id = localStorage.getItem('queue1_id') || 0;
            let queue2_id = localStorage.getItem('queue2_id') || 0;
            let queue3_id = localStorage.getItem('queue3_id') || 0;
            this.is_queue1 = this.is_queue1 || (localStorage.getItem('is_queue1') == "true")? true : false;
            this.is_queue2 = this.is_queue2 || (localStorage.getItem('is_queue2') == "true")? true : false;
            this.is_queue3 = this.is_queue3 || (localStorage.getItem('is_queue3') == "true")? true : false;

            this.selects = {
                "queue1" : {
                    name: "queue1", 
                    value:  localStorage.getItem('queue1_name') || "Default",
                    selected: queue1_id,
                    url: "queues?sort_by=tickets_count",
                    hidden: false,
                    is_disabled: false
                },
                "queue2" : {
                    name: "queue2", 
                    value:  localStorage.getItem('queue2_name') || "Default",
                    selected: queue2_id,
                    url: "queues?sort_by=tickets_count",
                    hidden: false,
                    is_disabled: false
                },
                "queue3" : {
                    name: "queue3", 
                    value:  localStorage.getItem('queue1_name') || "Default",
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
                this.selects.queue1.value = event.name || "Default";
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
                this.selects.queue2.value = event.name || "Default";
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
                this.selects.queue3.value = event.name || "Default";
            }
            break;
        }
    }

    onSubmit(form) {

            //TODO if other user changes what id should I write?  
            localStorage.setItem("queue1_id", this.selects.queue1.selected);
            localStorage.setItem("queue2_id", this.selects.queue2.selected);
            localStorage.setItem("queue3_id", this.selects.queue3.selected);
            localStorage.setItem("queue1_name", this.selects.queue1.value);
            localStorage.setItem("queue2_name", this.selects.queue2.value);
            localStorage.setItem("queue3_name", this.selects.queue3.value);
            localStorage.setItem("is_queue1", (this.is_queue1)? "1":"");
            localStorage.setItem("is_queue2", (this.is_queue2)? "1":"");
            localStorage.setItem("is_queue3", (this.is_queue3)? "1":"");
            
            this.nav.alert('Profile was updated');
        }
    

}
