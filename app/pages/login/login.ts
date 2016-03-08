import {Page, Config, NavController} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
import {OrganizationsPage} from '../organizations/organizations';
import {SignupPage} from '../signup/signup';

@Page({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
    constructor(nav: NavController, dataProvider: DataProvider, config: Config) {
    this.nav = nav;
                this.config = config;
        this.alert = this.config.alert;
        this.dataProvider = dataProvider;
      this.login = {};
      this.submitted = false;
  }

    onLogin(form) {
        this.submitted = true;
        if (form.valid) { this.dataProvider.checkLogin(form.value.email,form.value.password).subscribe(
                data => {
                    this.config.current.key =  data.api_token;
                    this.nav.push(OrganizationsPage);
                }, 
                error => { 
                    this.alert.error('There was a problem with your login.  Please try again.', 'Oops!');
                    this.login.password = "";
                    console.log(error || 'Server error');}
            ); 
        }
        else
            this.alert.error('Please enter email and password!', 'Oops!');
    }

    onSignup() {
        this.nav.push(SignupPage);
    }
}
