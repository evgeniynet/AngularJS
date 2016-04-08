import {Page, Config, NavController} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {AccountsListComponent, ActionButtonComponent} from '../../components/components';


@Page({
  templateUrl: 'build/pages/accounts/accounts.html',
    directives: [AccountsListComponent, ActionButtonComponent],
})
export class AccountsPage {

    count: number;
    is_empty: boolean;
    busy: boolean;
    params: Object;
    pager: Object;
    accounts: Array;

    constructor(private nav: NavController, private config: Config, private dataProvider: DataProvider) {
  }
    
    onPageWillEnter()
    {
        this.pager = { page: 0 };

        var timer = setTimeout(() => {
            this.busy = true;
        }, 500);

        this.getItems(null, timer);
    }


    getItems(infiniteScroll, timer) {
        this.dataProvider.getAccountList(false, this.pager, true, true).subscribe(
            data => {
                if (timer) {
                    clearTimeout(timer);
                    this.busy = false;
                    this.accounts = data;
                    this.config.current.stat.accounts = data.length;
                }
                else
                {
                    this.accounts.push(...data);
                    this.config.current.stat.accounts += data.length;
                }
                if (infiniteScroll) {
                    infiniteScroll.enable(data.length == 25);
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

    doInfinite(infiniteScroll) {
        if (this.count < 25) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        this.getItems(infiniteScroll, null);
    }
}
