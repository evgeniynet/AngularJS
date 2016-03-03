import {Page, NavController} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
import {AccountsListComponent, ActionButtonComponent} from '../../components/components';


@Page({
  templateUrl: 'build/pages/accounts/accounts.html',
    directives: [AccountsListComponent, ActionButtonComponent],
})
export class AccountsPage {
    constructor(nav: NavController, dataProvider: DataProvider) {
    this.nav = nav;
    this.accounts = null;
        
    dataProvider.getAccountList(false, true, true).subscribe(
            data => {this.accounts = data}, 
            error => { 
                console.log(error || 'Server error');}
        ); 
  }
}
