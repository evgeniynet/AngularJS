import {Page, NavController, Alert} from 'ionic-framework/ionic';
import {OrganizationsPage} from '../organizations/organizations';
import {SignupPage} from '../signup/signup';

@Page({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
  constructor(nav: NavController) {
    this.nav = nav;
      this.login = {};
      this.submitted = false;
  }

    onLogin(form) {
        this.submitted = true;

        if (form.valid) {
            this.nav.push(OrganizationsPage);
        }
        else
            this.doAlert();
    }

    onSignup() {
        this.nav.push(SignupPage);
    }
    
    doAlert() {
        let alert = Alert.create({
            title: 'Error!',
            subTitle: 'Please enter login and password',
            buttons: ['Ok']
        });
        this.nav.present(alert);
    }
}
