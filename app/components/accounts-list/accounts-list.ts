//in case on using ionic "ion-card"
import {IONIC_DIRECTIVES, NavController, NavParams} from 'ionic-framework/ionic';
import {Component, Input, Output} from 'angular2/core';
import {AccountDetailsPage} from '../../pages/account-details/account-details';
import {MorePipe} from '../../pipes/pipes';

@Component({
    selector: 'accounts-list',
    templateUrl: 'build/components/accounts-list/accounts-list.html',
directives: [IONIC_DIRECTIVES],
pipes: [MorePipe],
})

/*export interface Card {
    header:string;
    description:string; 
}*/

export class AccountsListComponent {
    @Input() accounts: Array;
    @Input() simple: boolean;
/*@Input()
card : Card;*/
     constructor(nav: NavController) {
         this.nav = nav;
    //this.header = "into";
}
     itemTapped(event, account) {this.nav.push(AccountDetailsPage, account);
                   }
     
}
