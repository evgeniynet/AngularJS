//in case on using ionic "ion-card"
import {IONIC_DIRECTIVES, Nav, NavParams, Config} from 'ionic-angular';
import {Component, Input, OnChanges} from '@angular/core';
import {AccountDetailsPage} from '../../pages/account-details/account-details';
import {MorePipe} from '../../pipes/pipes';

@Component({
    selector: 'accounts-list',
    templateUrl: 'build/components/accounts-list/accounts-list.html',
directives: [IONIC_DIRECTIVES],
pipes: [MorePipe],
})

export class AccountsListComponent {
    @Input() accounts: Array<any>;
    @Input() simple: boolean;
    is_empty: boolean;

     constructor(private nav: Nav, private config: Config) {
         this.is_empty = false;
}
     itemTapped(event, account) {
         account.account_statistics.ticket_counts.closed = null;
         this.nav.push(AccountDetailsPage, account);
                   }
     
     ngOnChanges(event) {
         if (!this.simple)
             return;
         if ("accounts" in event ) {
             if (event.accounts.isFirstChange() && event.accounts.currentValue !== null)
                 return;
             this.is_empty = !event.accounts.currentValue || event.accounts.currentValue.length == 0;
         }
     }
     
}
