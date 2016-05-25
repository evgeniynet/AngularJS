import {Page, Config, Nav} from 'ionic-angular';
import {saveCache} from '../../directives/helpers';
import {DataProvider} from '../../providers/data-provider';
import {LoginPage} from '../login/login';
import {OrganizationsPage} from '../organizations/organizations';
import {TicketsPage} from '../tickets/tickets';
import {DashboardPage} from '../dashboard/dashboard';

@Page({
  templateUrl: 'build/pages/signup/signup.html',
})
export class SignupPage {

	login: any;

	constructor(private nav: Nav, private dataProvider: DataProvider, private config: Config) {
  }

      onPageLoaded()
    { 
        //logout
        this.login = {username: localStorage.getItem("username") || ''};
        //$("#url").val(t.toLowerCase().replace(/[^a-zA-Z0-9-]/g, ''));
    }

    onSignup(form) {
        console.log(form.value.name);
        return;
        if (form.valid) { 
        	let data = {"name": form.value.name, 
                       "email": form.value.email, 
                       "url": form.value.url, 
                       "is_force_registration": form.value.force,
                       "firstname": form.value.firstname,
                       "lastname": form.value.lastname,
                       "password": form.value.password,
                       "password_confirm": form.value.password_confirm,
                       "how": form.value.how,
                       "note": "registered by iPhone app" //isPhonegap ? "registered by iPhone app" : "registered from m.sherpadesk.com"
                      };
        	this.apiData.get("organizations", data, "POST").subscribe(
                data => {
                    if (!data.api_token)
                    {
                        this.nav.push(LoginPage);
                        return;
                    }
                    if (!returnData.organization || !returnData.instance)
                    {
                        this.nav.push(OrganizationsPage);
                        return;
                    }

                    //sets user role to user in local storage
                    let cur = this.config.getCurrent();
                    cur.key = data.api_token;
                    cur.org = data.organization;
                    cur.instance = data.instance;
                    cur.user.email = instance;
                    this.config.saveCurrent();
                    //spicePixelTrackConversion();
                    //getappTrackConversion(url);
                    this.nav.alert("Thanks for registration! You are redirected to new org now ...");
                    //getInstanceConfig(returnData.organization, returnData.instance);
                }, 
                error => {
                	//showmodal
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
    
    onCancel() {
        this.nav.push(LoginPage);
    }
}
