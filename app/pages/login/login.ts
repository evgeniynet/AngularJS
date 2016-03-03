import {Page, Config, NavController} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
import {OrganizationsPage} from '../organizations/organizations';
import {SignupPage} from '../signup/signup';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

@Page({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
    constructor(nav: NavController, toastr: ToastsManager, dataProvider: DataProvider, config: Config) {
    this.nav = nav;
        this.alert = toastr;
        this.config = config;
        this.dataProvider = dataProvider;
      this.login = {};
      this.submitted = false;
  }

    onLogin(form) {
        this.submitted = true;
        if (form.valid) { this.dataProvider.checkLogin(form.value.email,form.value.password).subscribe(
                data => {
                    this.config.user.key =  data.api_token;
                    this.nav.push(OrganizationsPage);
                }, 
                error => { 
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
