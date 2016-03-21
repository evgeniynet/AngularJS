import {IONIC_DIRECTIVES, NavController, NavParams} from 'ionic-framework/ionic';
import {Component, Input, OnChanges} from 'angular2/core';
import {QueueTicketsPage} from '../../pages/queue-tickets/queue-tickets';
import {MorePipe} from '../../pipes/pipes';

@Component({
    selector: 'queues-list',
    templateUrl: 'build/components/queues-list/queues-list.html',
directives: [IONIC_DIRECTIVES],
pipes: [MorePipe],
})

export class QueuesListComponent {
    @Input() queues: Array;
    @Input() simple: boolean;

     constructor(nav: NavController) {
         this.nav = nav;
         this.is_empty = false;
}
     
     ngOnChanges(event) {
         if (!this.simple)
             return;
         if ("queues" in event ) {
             //TODO: add loading event
             if (event.queues.isFirstChange() && event.queues.currentValue !== null)
                 return;
             this.is_empty = !event.queues.currentValue || event.queues.currentValue.length == 0;
         }
     }
    
     goToQueueTicketsPage(queue) {
         this.nav.push(QueueTicketsPage, queue);
     }
     
}
