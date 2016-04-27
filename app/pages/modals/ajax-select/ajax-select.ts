import {NavController, NavParams, Page, Config, ViewController} from 'ionic-angular';
import {DataProvider} from '../../../providers/data-provider';
import {getFullName, addp} from '../../../directives/helpers';
import {Control} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import {URLSearchParams, Jsonp} from 'angular2/http';

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

    constructor(private nav: NavController, private navParams: NavParams, private config: Config, private dataProvider: DataProvider,
        private viewCtrl: ViewController/*, private jsonp: Jsonp*/) {
    }

    ngOnInit() {
        this.term = '';
        this.name = this.navParams.data.name || "List";
        this.url = this.navParams.data.url || "";
        this.data = this.navParams.data.items || {};
        this.pager = { limit: 10 };
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
        this.items =  q.length > 3 ? this.search(q) : Observable.of(this.data.filter((v) => {
            if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true;
            }
            return false;
        }));
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
            this.items = this.items.filter((v) => {
                if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                    return true;
                }
                return false;
            })
        else {
            var timer = setTimeout(() => { this.busy = true; }, 500);
            this.getItems(q, timer);
        }
        this.is_empty = !this.items.length;
    }

    getItems(term, timer) {
        this.items = [];
        this.dataProvider.getPaged(addp(this.url, "search", term), this.pager).subscribe(
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