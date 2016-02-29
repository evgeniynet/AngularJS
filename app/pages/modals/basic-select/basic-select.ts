import {NavController, NavParams, Page, Events, ViewController} from 'ionic-framework/ionic';
//import {Input} from 'angular2/core';

@Page({
    templateUrl: 'build/pages/modals/basic-select/basic-select.html',
})
export class BasicSelectModal {

    constructor(
    params: NavParams,
     viewCtrl: ViewController
    ) {
        this.viewCtrl = viewCtrl;
        this.params = params;
        this.items = this.params.data.items;
    }

    dismiss(item) {
        //let data = { 'foo': 'bar' };
        this.viewCtrl.dismiss(item);
    }
}