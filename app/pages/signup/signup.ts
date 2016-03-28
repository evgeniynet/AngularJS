import {Page, NavController} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/signup/signup.html',
})
export class SignupPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}
