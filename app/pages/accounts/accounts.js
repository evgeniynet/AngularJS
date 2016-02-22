import {Page, NavController} from 'ionic/ionic';
import {DataProvider} from '../../providers/data-provider';
import {AccountsListComponent} from '../../components/accounts-list/accounts-list';

/*
  Generated class for the AccountsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/accounts/accounts.html',
  directives: [AccountsListComponent],
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
