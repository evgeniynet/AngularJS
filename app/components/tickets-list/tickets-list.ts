import {IONIC_DIRECTIVES, NavController, NavParams, Config} from 'ionic-angular';
import {Component, Input, OnChanges, OnInit} from 'angular2/core';
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
    @Input() mode: string;
    @Input() count: number;
    tickets: Array;
     
    constructor(private nav: NavController, private navParams: NavParams, private config: Config, private dataProvider: DataProvider) {
        this.is_empty = false;
        this.pager = { page: 0 };
    }
     
     /*
     ngOnChanges(event) {
         if ("tickets" in event ) {
             //TODO: add loading event
             if (event.tickets.isFirstChange() && event.tickets.currentValue !== null)
                 return;
            this.is_empty = !event.tickets.currentValue || event.tickets.currentValue.length == 0;
     }
     }
     */

     ngOnInit() {
         if (!this.mode)
             return;
         if (this.count !== 0) {
             var timer = setTimeout(() => {
                 this.busy = true;
             }, 500);

             this.dataProvider.getTicketsList(this.mode).subscribe(
                 data => {
                     this.tickets = data;
                     this.count = data.length;
                     this.is_empty = !data.length;
                     clearTimeout(timer);
                     this.busy = false;
                 },
                 error => {
                     clearTimeout(timer);
                     this.busy = false;
                     console.log(error || 'Server error');
                 }
             );
         }
         else
         {
             this.is_empty = true; 
         }
    }

    itemTapped(event, ticket) {
        if (event.srcElement.tagName.toUpperCase() != "ION-ITEM-SLIDING") 
        this.nav.push(TicketDetailsPage, ticket);
    }


    doInfinite(infiniteScroll) {
        if (this.is_empty || this.count < 25)
         {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
         }
    console.log('Begin async operation');
    this.pager.page += 1; 
    this.dataProvider.getTicketsList(this.mode, "", this.pager).subscribe(
        data => {
            this.tickets.push(...data);
            //console.log(this.tickets);
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
