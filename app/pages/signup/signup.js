import {Page, NavController} from 'ionic/ionic';

@Page({
  templateUrl: 'build/pages/signup/signup.html',
})
export class SignupPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}
