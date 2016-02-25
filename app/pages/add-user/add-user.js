import {Page, NavController} from 'ionic/ionic';

@Page({
  templateUrl: 'build/pages/add-user/add-user.html',
})
export class AddUserPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}
