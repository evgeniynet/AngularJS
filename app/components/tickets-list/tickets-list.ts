import {IONIC_DIRECTIVES, NavController, NavParams, Config} from 'ionic-angular';
import {Component, Input, OnChanges, ElementRef} from 'angular2/core';
import {DataProvider} from '../../providers/data-provider';
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
     
    constructor(private nav: NavController, private navParams: NavParams, private config: Config, private dataProvider: DataProvider) {
        this.is_empty = false;
        this.pager = { page: 0 };
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


    doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    this.pager.page += 1; 
    this.dataProvider.getTicketsList("user", "", this.pager).subscribe(
        data => {
            this.tickets.push(...data);
            console.log(this.tickets);
            if (data.length < 25) {
                infiniteScroll.enable(false);
            }
            console.log('Async operation has ended');
            infiniteScroll.complete();
        },
        error => {
            console.log(error || 'Server error');
        }
    );
  }
}
