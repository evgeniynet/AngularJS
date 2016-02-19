import {IONIC_DIRECTIVES, NavController, NavParams} from 'ionic/ionic';
import {Component, Input, Output} from 'angular2/core';
import {QueueTicketsListPage} from '../../pages/queue-tickets-list/queue-tickets-list';
import {MorePipe} from '../../pipes/more';

@Component({
    selector: 'queues-list',
    templateUrl: 'build/components/queues-list/queues-list.html',
directives: [IONIC_DIRECTIVES],
pipes: [MorePipe],
})

/*export interface Card {
    header:string;
    description:string; 
}*/

export class QueuesListComponent {
    @Input() queues: Array;
/*@Input()
card : Card;*/
     constructor(nav: NavController) {
         this.nav = nav;
    //this.header = "into";
}
    
     goToQueueTicketsListPage(queue) {
         this.nav.push(QueueTicketsListPage, queue);
     }
     
}
