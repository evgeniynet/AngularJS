import {Page, Nav} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {LoginPage} from '../login/login';

@Page({
    templateUrl: 'build/pages/skype/skype.html',
})
export class SkypePage {

	is_skype_done: boolean = false;

    constructor(private nav: Nav, private dataProvider: DataProvider) {
    }

    onPageLoaded()
    { 
        this.onLoginSkype();
    }

    onLoginSkype() {
        var skype = localStorage.getItem('skype') || "";
        try {
            var data = JSON.parse(skype);
            if (data && typeof data === "object") {
                this.dataProvider.loginSkype(data).subscribe(
                    d => {
                        localStorage.setItem('skype', "");
                        this.is_skype_done = true;
                        this.nav.alert("Done! You can continue to chat in Skype ...");
                    }, 
                    error => {
                        localStorage.setItem('skype', "");
                        this.nav.alert(error, true);
                        console.log("error", error);
                    }
                    );
            }
        }
        catch (e) { 
            this.nav.alert('Cannot continue! Incorrect skype data', true);
        }
    }

    
    cancel_skype(){
        localStorage.setItem('skype', "");
        this.nav.setRoot(LoginPage, null, { animation: "wp-transition" });
    }
}
