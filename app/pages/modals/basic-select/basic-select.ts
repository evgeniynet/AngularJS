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
        this.searchQuery = '';
        this.params = params;
        this.name = this.params.data.name;
        this.data = this.params.data.items;
        this.items = this.data;
    }

    dismiss(item) {
        //let data = { 'foo': 'bar' };
        item = item || {};
        this.viewCtrl.dismiss(item);
    }
    
    getItems(searchbar) {
        // Reset items back to all of the items
        this.items = this.data;

        // set q to the value of the searchbar
        var q = searchbar.value;

        // if the value is an empty string don't filter the items
        if (q.trim() == '') {
            return;
        }

        this.items = this.items.filter((v) => {
            if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true;
            }
            return false;
        })
    }
}