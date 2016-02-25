import {IONIC_DIRECTIVES, NavController, NavParams} from 'ionic/ionic';
import {Component, Input} from 'angular2/core';
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
        this.nav = nav;
        this.navParams = navParams;
        this.tickets = [];
        //this.speaker = this.navParams.data;
    }

    itemTapped(event, ticket) {
        if (event.srcElement.tagName.toUpperCase() != "ION-ITEM-SLIDING") 
        this.nav.push(TicketDetailsPage, ticket);
    }
     
}
