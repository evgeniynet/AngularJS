import {Page, Config, NavController} from 'ionic-framework/ionic';
import {saveConfig, saveCache} from '../../directives/helpers';
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
  }
    
    onPageLoaded()
    { 
        //logout
        this.login = {username: localStorage.username };
        localStorage.clear();
        this.config.current = {stat:{}};
    }

    onLogin(form) {
        if (form.valid) { this.dataProvider.checkLogin(form.value.email,form.value.password).subscribe(
                data => {
                    saveConfig(this.config.current, data.api_token);
                    localStorage.username = form.value.email || "";
                    this.nav.push(OrganizationsPage);
                }, 
                error => {
                    let message = 'There was a problem with your login.  Check your login and password.';
                    
                    if(form.value.email && ~form.value.email.indexOf("@gmail.com")){
                        message = "Wrong Password, Google sign password is not neeeded";
                    }
                        this.alert.error(message, 'Oops!');
                    this.login.password = "";
                }
            ); 
        }
        else
            this.alert.error('Please enter email and password!', 'Oops!');
    }

    onGoogleSignip() {
        this.nav.push(SignupPage);
    }
    
    onSignup() {
        this.nav.push(SignupPage);
    }
}
