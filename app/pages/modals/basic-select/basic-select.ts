import {Nav, NavParams, Page, Events, ViewController, Modal, Config} from 'ionic-angular';
import {AddUserModal} from '../modals';
import {getFullName} from '../../../directives/helpers';
//import {Input} from '@angular/core';

@Page({
    templateUrl: 'build/pages/modals/basic-select/basic-select.html',
})
export class BasicSelectModal {

    items: Array<any>;
    name: string;
    displayname: string;
    searchQuery: string = '';
    default_text: string = "";
    data: any;
    is_empty: boolean = false;
    isdefault_enabled: boolean = false;
    isnew_enabled: boolean = false;

    constructor(
        private nav: Nav,
        private params: NavParams,
        private viewCtrl: ViewController,
        private config: Config
    ) {
        this.name = this.params.data.name;
        this.displayname = this.params.data.displayname || this.name;
        this.isdefault_enabled = !~["user", "account", "tech", "task type", "completed", "submission category"].indexOf(this.name.toLowerCase()) 
                                 ||  !!this.params.data.default;
        this.default_text = this.params.data.default || "Default";
        this.isnew_enabled = this.config.current.is_add_new_user_link && !!~["user", "tech"].indexOf(this.name.toLowerCase())
                                && !this.params.data.isnew_disabled;
        this.data = this.params.data.items;

        this.items = this.data;
    }

    onPageDidEnter() {
        var t = document.getElementsByClassName("searchbar-input");
        t = t[t.length - 1];
        t && t.focus();
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