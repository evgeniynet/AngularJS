//in case on using ionic "ion-card"
import {IONIC_DIRECTIVES, Nav, NavParams, Config} from 'ionic-angular';
import {Component, Input, OnChanges} from '@angular/core';
import {TechTicketsPage} from '../../pages/tech-tickets/tech-tickets';
import {MorePipe} from '../../pipes/pipes';

@Component({
    selector: 'techs-list',
    templateUrl: 'build/components/techs-list/techs-list.html',
directives: [IONIC_DIRECTIVES],
pipes: [MorePipe],
})

export class TechniciansListComponent {
    @Input() technicians: Array<any>;
    @Input() simple: boolean;
    is_empty: boolean;

     constructor(private nav: Nav, private config: Config) {
         this.is_empty = false;
}
     itemTapped(event, account) {
     //    account.account_statistics.ticket_counts.closed = null;
     //    this.nav.push(AccountDetailsPage, account);
                   }
     
    goToTechTicketsPage(technician) {
         this.nav.push(TechTicketsPage, technician);
     }

     ngOnChanges(event) {
         if (!this.simple)
             return;
         if ("technicians" in event ) {
             if (event.technicians.isFirstChange() && event.technicians.currentValue !== null)
                 return;
             this.is_empty = !event.technicians.currentValue || event.technicians.currentValue.length == 0;
         }
     }
     
}
