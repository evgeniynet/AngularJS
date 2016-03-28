import {IONIC_DIRECTIVES, NavController, NavParams} from 'ionic-angular';
import {Component, Input, OnChanges} from 'angular2/core';
import {TicketDetailsPage} from '../../pages/ticket-details/ticket-details';
import {GravatarPipe, LinebreaksPipe} from '../../pipes/pipes';


@Component({
    selector: 'tickets-list',
    templateUrl: 'build/components/tickets-list/tickets-list.html',
    directives: [IONIC_DIRECTIVES],
    pipes: [GravatarPipe, LinebreaksPipe],
})
export class TicketsListComponent {
    @Input() tickets: Array;
     
    constructor(nav: NavController, navParams: NavParams) {
        this.is_empty = false;
        this.nav = nav;
        this.navParams = navParams;
        //this.speaker = this.navParams.data;
    }
     
     ngOnChanges(event) {
         if ("tickets" in event ) {
             //TODO: add loading event
             if (event.tickets.isFirstChange() && event.tickets.currentValue !== null)
                 return;
            this.is_empty = !event.tickets.currentValue || event.tickets.currentValue.length == 0;
     }
     }

    itemTapped(event, ticket) {
        if (event.srcElement.tagName.toUpperCase() != "ION-ITEM-SLIDING") 
        this.nav.push(TicketDetailsPage, ticket);
    }
     
}
