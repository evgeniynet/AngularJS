import {Page, Config, Nav, Loading, Events} from 'ionic-angular';
import {ApiSite, Site, isSD, appVersion, AppTitle} from '../../providers/config';
import {openURL, openURLsystem} from '../../directives/helpers';
import {DataProvider} from '../../providers/data-provider';
import {OrganizationsPage} from '../organizations/organizations';
import {SignupPage} from '../signup/signup';

@Page({
    templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {

    login: any;
    google_action: string = "";
    busy: boolean = false;
    is_sd: boolean = isSD;
    fileDest: any = {ticket: "wonvhr"};
    //@ViewChild('google_openid') google_openid: NgForm;

    constructor(private nav: Nav, private dataProvider: DataProvider, private config: Config, private events: Events) {
        if (localStorage.getItem("isPhonegap") !== "true")
            this.google_action = ApiSite + 'auth/auth0';
        //clear also chrome ext if needed
        if (localStorage.getItem("isExtension") === "true")
            window.top.postMessage("logout", "*");
        events.publish("app:logout");
    }
    
    onPageLoaded()
    { 
        document.title = AppTitle + "Mobile App" ; 
        //logout
        this.login = {username: localStorage.getItem('username') || "" };
    }

    onLogin(form) {
        this.busy = true;
        if (form.valid) { 
            localStorage.setItem('username', form.value.email || "");
            this.dataProvider.checkLogin(form.value.email,form.value.password).subscribe(
                data => {
                    this.config.setCurrent({ "key": data.api_token});
                    this.nav.setRoot(OrganizationsPage, null, { animation: "wp-transition" });
                }, 
                error => {
                    let message = 'There was a problem with your login.  Check your login and password.';
                    
                    if(form.value.email && ~form.value.email.indexOf("@gmail.com")){
                        message = "Wrong Password, maybe you used Google password";
                    }
                    this.nav.alert(message, true);
                    this.login.password = "";
                    this.busy = false;
                }
                ); 
        }
        else
        {
            this.nav.alert('Please enter email and password!', true);
            this.busy = false;
        }
    }

    ngAfterViewInit() {
        //console.log(this.starttime.min);
        //this.google_openid.action = this.starttime.displayFormat = this.displayFormat;
        //console.log(this.starttime.displayFormat);
    }

    support()
    {
        openURLsystem(`https://support.${Site}portal/`);
    }

    onGoogleSignin() {

        if ("true" !== localStorage.getItem("isPhonegap"))      
            window.location.href = ApiSite + 'auth/auth0'
        else
        {
            var url = ApiSite + "auth/auth0?ios_action="+(localStorage.isIos || localStorage.isIosStatus || "");

            window.win = null;
            window.nameInterval = null;
            
            window.onExit = function() {
                clearInterval(window.nameInterval);
                window.win.close();
                window.t1 = null;
                var element1 = document.createElement("script");
                element1.src = "build/js/vendor.bundle.js";
                document.body.appendChild(element1);
                setTimeout(window.reloadScript, 2000);
            };

            window.win = window.open(url, "_blank", "location=no" );
            
            window.win.addEventListener( "loadstop", function() {
                ({ code: "localStorage.setItem('current', '')" });
                window.nameInterval = setInterval(function() {
                    window.win.executeScript({ code: "localStorage.getItem('current')" }, function(values) {
                        var name = values[0];
                        if (name)
                        {
                            localStorage.current = name;
                            var c = JSON.parse(name || "null") || {};
                            if (!!c.org && !!c.instance && !!c.key)
                                window.onExit();
                        }
                    });
                }, 1000)
            });
            
            window.win.addEventListener('exit', function() {
                window.onExit(); 
            });
        }
    }

        /*else
            openURLsystem(ApiSite + 'auth/auth0?ios_action=');
        else
        {
            console.log("isPhonegap", localStorage.getItem("isPhonegap"));
            var win = openURL(ApiSite + 'auth/auth0');
            var onExit = function() {
                console.log("onExit", 1);
                location.href = 'index.html';
            };
            win.addEventListener( "loadstop", function() {
                console.log("loadstop", 1);
                var loop = setInterval(function() {
                    win.executeScript(
                    {
                        code: "localStorage.getItem('isGoogle')"
                    },
                    function( values ) {
                        console.log("values", values);
                        var name = values[0];
                        if (name) {
                            clearInterval(loop);
                            win.close();
                            onExit();
                        }
                    }
                    );
                });
            });
            win.addEventListener('exit', onExit);
            return;
        }*/
    
    onSignup() {
        this.nav.push(SignupPage, null, { animation: "wp-transition" });
    }
}
