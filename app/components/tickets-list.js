//in case on using ionic "ion-card"
//import {IONIC_DIRECTIVES} from 'ionic/ionic';
import {Component, Input, Output} from 'angular2/core';

@Component({
selector: 'tickets-list-component',
templateUrl: 'build/components/tickets-list.html',
//directives: [IONIC_DIRECTIVES]
})

/*export interface Card {
    header:string;
    description:string; 
}*/

export class TicketsListComponent {
@Input() header: string;
/*@Input()
card : Card;*/
constructor() {
    //this.header = "into";
}

}
