import {Page, Config, Nav} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {AjaxSearchPage} from '../ajax-search/ajax-search';
import {AccountsListComponent, ActionButtonComponent} from '../../components/components';


@Page({
  templateUrl: 'build/pages/accounts/accounts.html',
    directives: [AccountsListComponent, ActionButtonComponent],
})
export class AccountsPage {

    count: number;
    is_empty: boolean;
    busy: boolean;
    params: any;
    pager: any;
    test: boolean;
    search_results: any;
    accounts: Array<any>;
    LIMIT: number = 500;

    constructor(private nav: Nav, private config: Config, private dataProvider: DataProvider) {
  }
    
    onPageLoaded()
    {
        this.pager = { page: 0, limit: this.LIMIT };

        var timer = setTimeout(() => {
            this.busy = true;
        }, 500);

        this.getItems(null, timer);
    }

    searchItems(searchbar) {
        // Reset items back to all of the items
        this.search_results = [];

        // set q to the value of the searchbar
        var q = searchbar.value;

        // if the value is an empty string don't filter the search_results
        if (q.trim() == '' || this.busy) {
            return;
        }

        if (q.length > 1)
        {
            var timer = setTimeout(() => { this.busy = true; }, 500);
            this.getItems(q, timer);
        }
    }

    getItems(infiniteScroll, timer) {
        this.dataProvider.getAccountList(false, this.pager, true, true).subscribe(
            data => {
                if (timer) {
                    clearTimeout(timer);
                    this.busy = false;
                    this.accounts = data;
                    //this.config.setStat("accounts", data.length);
                }
                else
                {
                    this.accounts.push(...data);
                    //TODO: how do get accounts stat
                    this.config.current.stat.accounts += data.length;
                }
                if (infiniteScroll) {
                    infiniteScroll.enable(data.length == this.LIMIT);
                    infiniteScroll.complete();
                }
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

    clearSearch(searchbar?)
    {
        this.search_results = [];
        this.busy = false;
        if (searchbar) searchbar.value = "";
    }

    getSearch(searchbar) {
        this.test = false;
        this.clearSearch();
        // Reset items back to all of the items
        // set q to the value of the searchbar
        let term = searchbar.target.value;
        if (term.length < 4)
            term += "    ";
        let list = { search: term };
        this.test = false;
        this.nav.push(AjaxSearchPage, list);
    }

    doInfinite(infiniteScroll) {
        if (this.count < this.LIMIT) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        this.getItems(infiniteScroll, null);
    }
}
