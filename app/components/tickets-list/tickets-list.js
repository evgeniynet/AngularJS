import {IONIC_DIRECTIVES, NavController, NavParams} from 'ionic/ionic';
import {Component, Input, Output} from 'angular2/core';
import {TicketDetailsPage} from '../../pages/ticket-details/ticket-details';


@Component({
    selector: 'tickets-list',
    templateUrl: 'build/components/tickets-list/tickets-list.html',
    directives: [IONIC_DIRECTIVES],
})
export class TicketsListComponent {
    @Input() tickets: Array;
     
    constructor(nav: NavController, navParams: NavParams) {
        this.nav = nav;
        this.navParams = navParams;
        //this.speaker = this.navParams.data;
    }

    itemTapped() {this.nav.push(TicketDetailsPage);}

}
