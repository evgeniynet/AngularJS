import {Nav, NavParams, Page, Events, ViewController} from 'ionic-angular';
//import {Input} from '@angular/core';

@Page({
    templateUrl: 'build/pages/modals/basic-select/basic-select.html',
})
export class BasicSelectModal {

    items: Array<any>;
    name: string;
    searchQuery: string = '';
    data: any;
    is_empty: boolean = false;

    constructor(
        private params: NavParams,
        private viewCtrl: ViewController
    ) {
        nav.swipeBackEnabled = false;
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

        this.items = this.items.filter((v) => v.name.toLowerCase().indexOf(q.toLowerCase()) > -1);
        this.is_empty = !this.items.length;
    }
}