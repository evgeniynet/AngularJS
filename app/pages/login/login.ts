import {Page, Config, NavController} from 'ionic-angular';
import {saveCache} from '../../directives/helpers';
import {DataProvider} from '../../providers/data-provider';
import {OrganizationsPage} from '../organizations/organizations';
import {SignupPage} from '../signup/signup';

@Page({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
    login: Object;

    constructor(private nav: NavController, private dataProvider: DataProvider, private config: Config) {
  }
    
    onPageLoaded()
    { 
        //logout
        this.login = {username: localStorage.username };
        localStorage.clear();
        this.config.clearCurrent();
    }

    onLogin(form) {
        if (form.valid) { this.dataProvider.checkLogin(form.value.email,form.value.password).subscribe(
                data => {
                    this.config.setCurrent({ key:data.api_token });
                    this.config.saveCurrent();
                    localStorage.username = form.value.email || "";
                    this.nav.push(OrganizationsPage);
                }, 
                error => {
                    let message = 'There was a problem with your login.  Check your login and password.';
                    
                    if(form.value.email && ~form.value.email.indexOf("@gmail.com")){
                        message = "Wrong Password, Google sign password is not neeeded";
                    }
                    this.nav.alert(message, true);
                    this.login.password = "";
                }
            ); 
        }
        else
            this.nav.alert('Please enter email and password!', true);
    }

    onGoogleSignip() {
        this.nav.push(SignupPage);
    }
    
    onSignup() {
        this.nav.push(SignupPage);
    }
}
