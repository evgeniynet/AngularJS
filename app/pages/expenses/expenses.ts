import {Page, Config, NavController, NavParams} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {getCurrency} from '../../directives/helpers';
import {ExpenseCreatePage} from '../expense-create/expense-create';
import {ActionButtonComponent} from '../../components/action-button/action-button';
import {GravatarPipe, MorePipe, LinebreaksPipe} from '../../pipes/pipes';

@Page({
    templateUrl: 'build/pages/expenses/expenses.html',
    directives: [ActionButtonComponent],
    pipes: [GravatarPipe, MorePipe, LinebreaksPipe],
})
export class ExpensesPage {
    LIMIT: number = 15;
    count: number;
    account: Object;
    is_empty: boolean;
    busy: boolean;
    params: Object;
    pager: Object;
    expenses: Array;


    constructor(private nav: NavController, private dataProvider: DataProvider, private config: Config, private navParams: NavParams) {
        this.is_empty = false;
    }
    
    onPageLoaded() {
        this.params = this.navParams.data || {};
        this.pager = { page: 0 };
        this.params.account = { id: this.params.account_id || -1, name: this.params.account_name || this.config.getCurrent("user").account_name };

        if (this.params.is_empty)
            this.params.count = 0;

        if (this.params.count !== 0) {
            var timer = setTimeout(() => {
                this.busy = true;
            }, 500);

            this.getItems(null, timer);
        }
        else
            this.is_empty = true;
    }


    getItems(infiniteScroll, timer) {
        this.dataProvider.getExpenses(this.params.account.id, this.pager).subscribe(
            data => {
                if (timer) {
                    this.is_empty = !data.length;
                    clearTimeout(timer);
                    this.busy = false;
                    this.expenses = data;
                }
                else
                    this.expenses.push(...data);
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

    doInfinite(infiniteScroll) {
        if (this.is_empty || this.count < 25) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        this.getItems(infiniteScroll, null);
    }

    itemTapped(time) {
        this.nav.push(ExpenseCreatePage, time);
    }
    
    setDate(date) {
        return date ? new Date(date) : null;
    }

    getCurrency(value) {
        return getCurrency(value, this.config.getCurrent("currency");
    }
}
