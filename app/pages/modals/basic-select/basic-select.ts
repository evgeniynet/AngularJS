import {Nav, NavParams, Page, Events, ViewController, Modal} from 'ionic-angular';
import {AddUserModal} from '../modals';
import {getFullName} from '../../../directives/helpers';
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
    isdefault_enabled: boolean = false;
    isnew_enabled: boolean = false;

    constructor(
        private nav: Nav,
        private params: NavParams,
        private viewCtrl: ViewController
    ) {
        this.name = this.params.data.name;
        this.isdefault_enabled = !~["user", "account", "tech", "task type"].indexOf(this.name.toLowerCase());
        this.isnew_enabled = !!~["user", "tech"].indexOf(this.name.toLowerCase());
        this.data = this.params.data.items;
        this.items = this.data;
    }

    dismiss(item) {
        //let data = { 'foo': 'bar' };
        item = item || {};
        this.viewCtrl.dismiss(item);
    }

    invite()
    {
        let myModal = Modal.create(AddUserModal, {type: this.name.toLowerCase(), name: this.searchQuery});
        myModal.onDismiss(data => {
            if (data){
                //console.log(data);
                data.name = getFullName(data.firstname, data.lastname, data.email);
                this.dismiss(data);
            //this.selects[type].selected = data.id;
            //this.selects[type].value = getFullName(data.firstname, data.lastname, data.email);
        }
        });
        this.nav.present(myModal);
        //setTimeout(() => { this.nav.present(myModal); }, 500);
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