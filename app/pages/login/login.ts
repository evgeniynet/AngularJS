import {Page, NavController} from 'ionic-framework/ionic';

@Page({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}
