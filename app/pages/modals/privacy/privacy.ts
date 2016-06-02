import {Nav, NavParams, Page, Events, ViewController} from 'ionic-angular';

@Page({
    templateUrl: 'build/pages/modals/privacy/privacy.html',
})
export class PrivacyModal {

    constructor(
        private nav: Nav,
        private viewCtrl: ViewController
    ) {
        nav.swipeBackEnabled = false;
    }

    dismiss(item) {
        this.viewCtrl.dismiss();
    }
}