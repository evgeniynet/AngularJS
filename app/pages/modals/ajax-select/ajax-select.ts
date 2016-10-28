import {Nav, NavParams, Page, Config, ViewController, Modal} from 'ionic-angular';
import {ApiData} from '../../../providers/api-data';
import {AddUserModal} from '../modals';
import {getFullName, addp} from '../../../directives/helpers';
import {Control} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import {URLSearchParams, Jsonp} from '@angular/http';

@Page({
    templateUrl: 'build/pages/modals/ajax-select/ajax-select.html',
})
export class AjaxSelectModal {

    items: any;
    //term = new Control();
    url: string;
    term: string;
    search: string;
    name: string;
    data: any;
    pager: any;
    count: number;
    is_empty: boolean;
    busy: boolean;
    isdefault_enabled: boolean = false;
    isnew_enabled: boolean = false;

    constructor(private nav: Nav, private navParams: NavParams, private config: Config, private apiData: ApiData,
        private viewCtrl: ViewController/*, private jsonp: Jsonp*/) {
        nav.swipeBackEnabled = false;
    }

    ngOnInit() {
        this.term = '';
        this.name = this.navParams.data.name || "List";
        this.isdefault_enabled = !~["user", "account", "tech", "task type"].indexOf(this.name.toLowerCase());
        this.isnew_enabled = !!~["user", "tech"].indexOf(this.name.toLowerCase());
        this.url = this.navParams.data.url || "";
        this.data = this.navParams.data.items || {};
        this.pager = { limit: 20 };
        this.items = this.data;
        this.count = this.items.length;
        this.is_empty = false;
        if (this.items.length === 0) {
            var timer = setTimeout(() => {
                this.busy = true;
            }, 500);

            this.getItems(null, timer);
        }
    }

    dismiss(item) {
        item = item || {};
        this.viewCtrl.dismiss(item);
    }

    invite()
    {
        let myModal = Modal.create(AddUserModal, {type: this.name.toLowerCase(), name: this.term || " "});
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

/*
    newsearch(searchbar) {
        // Reset items back to all of the items
        //this.items = this.data;

        // set q to the value of the searchbar
        var q = searchbar.value;

        // if the value is an empty string don't filter the items
        if (q.trim() == '') {
            return;
        }
        this.items =  q.length > 3 ? this.search(q) : Observable.of(this.data.filter((v) => v.name.toLowerCase().indexOf(q.toLowerCase()) > -1));
    }
*/
    searchItems(searchbar) {
        // Reset items back to all of the items
        this.items = this.data;

        // set q to the value of the searchbar
        var q = searchbar.value;

        // if the value is an empty string don't filter the items
        if (q.trim() == '' || this.busy) {
            if (q.trim() == '') this.is_empty = !this.items.length;
            return;
        }

        if (q.length < 3)
        {
            this.items = this.items.filter((v) => v.name.toLowerCase().indexOf(q.toLowerCase()) > -1);
                    this.is_empty = !this.items.length;
        }
        else {
            var timer = setTimeout(() => { this.busy = true; }, 500);
            this.getItems(q, timer);
        }
    }

    getItems(term, timer) {
        this.items = [];
        //console.log(this.name);
        if (~["location", "account"].indexOf(this.name.toLowerCase()))
        {
            term = term+"*";
        }
        this.apiData.getPaged(addp(this.url, "search", term), this.pager).subscribe(
            data => {
                if (data.length && !data[0].name) {
                    var results = [];
                    data.forEach(item => {
                        let name;
                        //if users or techs
                        if (item.email)
                            name = getFullName(item.firstname, item.lastname, item.email, " ");
                        results.push({ id: item.id, name: name });
                    });
                    data = results;
                }
                if (timer) {
                    clearTimeout(timer);
                    this.busy = false;
                }
                this.is_empty = !data.length;

                if (!term)
                {
                    this.items = this.data = data;
                }
                else
                    this.items = data;

                this.count = data.length;
            },
            error => {
                if (timer) {
                    clearTimeout(timer);
                    this.busy = false;
                }
                console.log(error || 'Server error');
            }
            );
    }
}