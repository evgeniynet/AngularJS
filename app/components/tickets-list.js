//in case on using ionic "ion-card"
import {IONIC_DIRECTIVES, NavController, NavParams} from 'ionic/ionic';
import {Component, Input, Output} from 'angular2/core';
import {QueuesPage} from '../pages/queues/queues';

@Component({
selector: 'tickets-list-component',
templateUrl: 'build/components/tickets-list.html',
directives: [IONIC_DIRECTIVES]
})

/*export interface Card {
    header:string;
    description:string; 
}*/

export class TicketsListComponent {
    @Input() queues: Array;
/*@Input()
card : Card;*/
     constructor(nav: NavController) {
         this.nav = nav;
    //this.header = "into";
}
     itemTappedQ() {this.nav.push(QueuesPage);}
     
}
