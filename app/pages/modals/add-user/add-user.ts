import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {FORM_DIRECTIVES, Validators} from '@angular/common';
import {DataProvider} from '../../../providers/data-provider';
//import {htmlEscape, getFullName} from '../../../directives/helpers';

@Page({
  templateUrl: 'build/pages/modals/add-user/add-user.html',
})
export class AddUserModal {

    ispassword: boolean;
    data: any;
    firstname_m: string = "";

	constructor(private nav: Nav, private navParams: NavParams, private dataProvider: DataProvider, private config: Config,
		private viewCtrl: ViewController) {
        nav.swipeBackEnabled = false;
    }

    ngOnInit() {
		this.ispassword = true;
        this.data = (this.navParams.data || {}).type || {};
        this.firstname_m = (this.navParams.data || {}).name || " ";
        //this.data.type = this.data;
	}

    ngAfterViewInit() {   
        setTimeout(function(){var s = document.getElementsByTagName("ion-page")[0];s.style.display='none';s.offsetHeight;s.style.display=''}, 200);         
        this.firstname_m = this.firstname_m.trim();
    }

    dismissPage(data) {
        this.viewCtrl.dismiss(data);
    }

    onSubmit(form) {
        if (form.valid) {
            this.dataProvider.addUser(form.value.email, form.value.firstname, form.value.lastname, this.data.type).subscribe(
                data => {
                   // this.nav.alert(this.data.charAt(0).toUpperCase() + this.data.slice(1) + ' was created :)');
                    setTimeout(() => {
                        this.dismissPage(data);
                    }, 1000);
                },
                error => {
                    this.nav.alert(form.value.email + ' already exists! Please try again', true);
                    console.log(error || 'Server error');
                });
    }
}
}
