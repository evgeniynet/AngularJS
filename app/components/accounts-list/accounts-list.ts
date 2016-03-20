//in case on using ionic "ion-card"
import {IONIC_DIRECTIVES, NavController, NavParams} from 'ionic-framework/ionic';
import {Component, Input, OnChanges} from 'angular2/core';
import {AccountDetailsPage} from '../../pages/account-details/account-details';
import {MorePipe} from '../../pipes/pipes';

@Component({
    selector: 'accounts-list',
    templateUrl: 'build/components/accounts-list/accounts-list.html',
directives: [IONIC_DIRECTIVES],
pipes: [MorePipe],
})

export class AccountsListComponent {
    @Input() accounts: Array;
    @Input() simple: boolean;

     constructor(nav: NavController) {
         this.nav = nav;
         this.is_empty = false;
}
     itemTapped(event, account) {this.nav.push(AccountDetailsPage, account);
                   }
     
     ngOnChanges(event) {
         if (!simple)
             return;
         if ("accounts" in event ) {
             if (event.accounts.isFirstChange())
                 return;
             this.is_empty = !event.accounts.currentValue || event.accounts.currentValue.length == 0;
         }
     }
     
}
