import {Page, NavController} from 'ionic/ionic';
import {AccountDetailsPage} from '../account-details/account-details';

/*
  Generated class for the AccountsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/accounts/accounts.html',
})
export class AccountsPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
    
    itemTapped() {this.nav.push(AccountDetailsPage);}
}
