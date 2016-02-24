import {Page, ActionSheet, NavController} from 'ionic/ionic';
import {DataProvider} from '../../providers/data-provider';
import {AccountsListComponent} from '../../components/accounts-list/accounts-list';
import {ActionButtonComponent} from '../../components/action-button/action-button';


@Page({
  templateUrl: 'build/pages/accounts/accounts.html',
    directives: [AccountsListComponent, ActionButtonComponent],
})
export class AccountsPage {
    constructor(nav: NavController, dataProvider: DataProvider) {
    this.nav = nav;
    this.accounts = null;
        
    dataProvider.getAccountList().subscribe(
            data => {this.accounts = data}, 
            error => { 
                console.log(error || 'Server error');}
        ); 
  }
}
