import {Page, NavController} from 'ionic-framework/ionic';
import {OrganizationsPage} from '../organizations/organizations';
import {SignupPage} from '../signup/signup';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

@Page({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
    constructor(nav: NavController, toastr: ToastsManager) {
    this.nav = nav;
      this.login = {};
      this.submitted = false;
        this.alert = toastr;
  }

    onLogin(form) {
        this.submitted = true;

        if (form.valid) {
            this.nav.push(OrganizationsPage);
        }
        else
            this.alert.error('Please enter email and password!', 'Oops!');
    }

    onSignup() {
        this.nav.push(SignupPage);
    }
}
