import {Page, Config, Nav} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {ApiSite} from '../../providers/config';
//import {NgForm} from '@angular/common';
import {saveCache} from '../../directives/helpers';
import {DataProvider} from '../../providers/data-provider';
import {OrganizationsPage} from '../organizations/organizations';
import {SignupPage} from '../signup/signup';

@Page({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
    
    login: any;
    google_action: string = "";
    //@ViewChild('google_openid') google_openid: NgForm;

    constructor(private nav: Nav, private dataProvider: DataProvider, private config: Config) {
        this.google_action = ApiSite + 'auth/auth0';
  }
    
    onPageLoaded()
    { 
        //logout
        this.login = {username: this.config.current.username || "" };
        localStorage.clear();
        //this.config.clearCurrent();
    }

    onLogin(form) {
        if (form.valid) { this.dataProvider.checkLogin(form.value.email,form.value.password).subscribe(
                data => {
                    this.config.setCurrent({ "key": data.api_token, "username": form.value.email || "" });
                    this.config.saveCurrent();
                    this.nav.setRoot(OrganizationsPage, null, { animation: "wp-transition" });
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

    ngAfterViewInit() {
        //console.log(this.starttime.min);
        //this.google_openid.action = this.starttime.displayFormat = this.displayFormat;
        //console.log(this.starttime.displayFormat);
    }

    onGoogleSignin() {
        console.log("onGoogleSignin");
    }
    
    onSignup() {
        this.nav.setRoot(SignupPage, null, { animation: "wp-transition" });
    }
}
