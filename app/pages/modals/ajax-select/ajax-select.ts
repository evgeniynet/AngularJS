import {Nav, NavParams, Page, Config, ViewController} from 'ionic-angular';
import {ApiData} from '../../../providers/api-data';
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

    constructor(private nav: Nav, private navParams: NavParams, private config: Config, private apiData: ApiData,
        private viewCtrl: ViewController/*, private jsonp: Jsonp*/) {
        nav.swipeBackEnabled = false;
    }

    ngOnInit() {
        this.term = '';
        this.name = this.navParams.data.name || "List";
        this.url = this.navParams.data.url || "";
        this.data = this.navParams.data.items || {};
        this.pager = { limit: 20 };
        this.items = this.data;
        this.count = this.items.length;
        this.is_empty = false;
        console.log("init");
        console.log(this.items);
        if (this.items.length === 0) {
            var timer = setTimeout(() => {
                this.busy = true;
            }, 500);

            this.getItems(null, timer);
        }
    }

    dismiss(item) {
        //let data = { 'foo': 'bar' };
        item = item || {};
        this.viewCtrl.dismiss(item);
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
            return;
        }

        if (q.length < 3)
            this.items = this.items.filter((v) => v.name.toLowerCase().indexOf(q.toLowerCase()) > -1);
        else {
            var timer = setTimeout(() => { this.busy = true; }, 500);
            this.getItems(q, timer);
        }
        this.is_empty = !this.items.length;
    }

    getItems(term, timer) {
        this.items = [];
        this.apiData.getPaged(addp(this.url, "search", term), this.pager).subscribe(
            data => {
                console.log("data");
                console.log(data);
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
                console.log("items");
                console.log(this.items);
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