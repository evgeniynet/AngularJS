import {Page, Config, Nav, Loading} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {ApiSite, Site, isSD, appVersion, AppTitle} from '../../providers/config';
//import {NgForm} from '@angular/common';
import {openURL, openURLsystem} from '../../directives/helpers';
import {DataProvider} from '../../providers/data-provider';
import {OrganizationsPage} from '../organizations/organizations';
import {SignupPage} from '../signup/signup';
import {UploadButtonComponent} from '../../components/components';

@Page({
  templateUrl: 'build/pages/login/login.html',
  directives: [UploadButtonComponent],
})
export class LoginPage {
    
    icon: String = "add-circle";
    login: any;
    google_action: string = "";
    busy: boolean = false;
    is_sd: boolean = isSD;
    files: any = {};
    //@ViewChild('google_openid') google_openid: NgForm;

    constructor(private nav: Nav, private dataProvider: DataProvider, private config: Config) {
        if (localStorage.getItem("isPhonegap") !== "true")
        this.google_action = ApiSite + 'auth/auth0';
        //clear also chrome ext if needed
        if (localStorage.getItem("isExtension") === "true")
            window.top.postMessage("logout", "*");
  }
    
    onPageLoaded()
    { 
        this.icon1 = "ios-add";
        document.title = AppTitle + "Mobile App" ; 
        //logout
        this.login = {username: localStorage.getItem('username') || "" };
        this.config.clearCurrent();
    }

    uploadFile(event)
    {
        console.log(event.length);
        this.files = event;
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

    onUpload(form) {
        if (form.valid) { 
            console.log(form);
            if (!this.files.length) {
        return;
    }
            let xhr:XMLHttpRequest = new XMLHttpRequest();
            
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log(xhr.response);
                } else {
                    console.log(xhr.response);
                }
            }
        };

        xhr.open('POST', "http://api.beta.sherpadesk.com/files/", true);
xhr.setRequestHeader("Authorization", "Basic " + btoa("u0diuk-b95s6o:2mzer2k5k0srgncebsizvfmip0isp2ii"));
            //xhr.withCredentials = true;
        let formData: FormData = new FormData();
        formData.append("ticket", "wonvhr");
        for (let i = 0; i < this.files.length; i++) {
            formData.append("uploads[]", this.files[i], this.files[i].name);
        }

        xhr.send(formData);
            }
    }
/*
    uploadFile(file:File):Promise<MyEntity> {
    return new Promise((resolve, reject) => {

        let xhr:XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(<MyEntity>JSON.parse(xhr.response));
                } else {
                    reject(xhr.response);
                }
            }
        };

        xhr.open('POST', "http://u0diuk-b95s6o:2mzer2k5k0srgncebsizvfmip0isp2ii@api.beta.sherpadesk.com/files/", true);

        let formData = new FormData();
        formData.append("file", file, file.name);
        xhr.send(formData);
    });
}
*/
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
        if (localStorage.getItem("isPhonegap") !== "true") {
            window.location.href = ApiSite + 'auth/auth0';
        }
        else
        {
            var win = openURL(ApiSite + 'auth/auth0');
            var onExit = function() {
                location.href = 'index.html';
            };
                    win.addEventListener( "loadstop", function() {
                        var loop = setInterval(function() {
                            win.executeScript(
                                {
                                    code: "localStorage.getItem('isGoogle')"
                                },
                                function( values ) {
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
                }
    }
    
    onSignup() {
        this.nav.push(SignupPage, null, { animation: "wp-transition" });
    }
}
