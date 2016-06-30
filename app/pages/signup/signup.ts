import {Page, Config, Nav, Events, Alert, Modal} from 'ionic-angular';
import {saveCache, spicePixelTrackConversion, getappTrackConversion} from '../../directives/helpers';
import {DataProvider} from '../../providers/data-provider';
import {LoginPage} from '../login/login';
import {OrganizationsPage} from '../organizations/organizations';
import {TicketsPage} from '../tickets/tickets';
import {DashboardPage} from '../dashboard/dashboard';
import {PrivacyModal} from '../modals/modals';

@Page({
  templateUrl: 'build/pages/signup/signup.html',
})
export class SignupPage {

	login: any = {};
    is_force_registration: boolean = false;

    constructor(private nav: Nav, private dataProvider: DataProvider, private config: Config, private events: Events) {
  }

      onPageLoaded()
    { 
        //logout
        this.is_force_registration = false;
    }

getUrl(name){
    this.login.name = name.value || "";
    this.login.url = name.value ? name.value.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '') : "";
}

    onSignup(form) {
        if (form.valid) { 
        	let data = {
                       "name": form.value.name, 
                       "email": form.value.email, 
                       "url": form.value.url, 
                       "is_force_registration": this.is_force_registration,
                       "is_force_redirect": false,
                       "firstname": form.value.firstname,
                       "lastname": form.value.lastname,
                       "password": form.value.password,
                       "password_confirm": form.value.password_confirm,
                       "how": form.value.how,
                       "note": localStorage.getItem("isPhonegap") === "true" ? "registered by iPhone app" : "registered from m.sherpadesk.com"
                      };

        	this.dataProvider.registerOrganization(data).subscribe(
                data => {
                    if (!data.api_token)
                    {
                        this.nav.setRoot(LoginPage,  null, { animation: "wp-transition" });
                        return;
                    }
                    if (!data.organization || !data.instance)
                    {
                        this.nav.setRoot(OrganizationsPage, null, { animation: "wp-transition" });
                        return;
                    }

                    //sets user role to user in local storage
                    this.config.setCurrent({
                        "key": data.api_token,
                        "org": data.organization,
                        "instance": data.instance
                    });
                    //this.config.current.user.email = form.value.email;
                    this.config.saveCurrent();
                    spicePixelTrackConversion();
                    getappTrackConversion(form.value.url);
                    this.nav.alert("Thanks for registration! You are redirected to new org now ...");
                    setTimeout(() => this.events.publish("config:get", true), 3000);
                }, 
                error => {
                    if (~error.toString().indexOf("409"))
                    {
                        this.presentConfirm();
                    }
                    else
                        this.nav.alert(error, true);
                }
            ); 
        }
        else
            this.nav.alert('Please fill the form!', true);
    }

    presentConfirm() {
        let alert = Alert.create({
            title: "Wait. Haven't I seen you?",
            subTitle: "This email is already in use.",
            message: 'Would you like to',
            cssClass: "hello",
            buttons: [
                {
                    text: 'Login',
                    role: 'cancel',
                    handler: () => {
                        this.config.current.username = this.login.email;
                        alert.dismiss().then(() => {
                            this.nav.setRoot(LoginPage, null, { animation: "wp-transition" });
                        });
                        return false;
                    }
                },
                {
                    text: 'Create New Org',
                    handler: () => {
                        // user has clicked the alert button
                        // begin the alert's dimiss transition
                        let navTransition = alert.dismiss();
                        this.is_force_registration = true;
                        navTransition.then(() => {
                            var form = {valid: true, value: this.login}
                            this.onSignup(form);
                        });
                        return false;
                    }
                }
            ]
        });
        this.nav.present(alert);
    }

    onGoogleSignip() {
        this.nav.setRoot(SignupPage), null, { animation: "wp-transition" };
    }

    gotoPrivacy(){
        this.nav.present(Modal.create(PrivacyModal));
    }
    
    onCancel() {
        this.nav.setRoot(LoginPage, null, { animation: "wp-transition" });
    }
}
