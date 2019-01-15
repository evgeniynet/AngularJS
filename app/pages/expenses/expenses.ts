import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {getDateTime, getCurrency} from '../../directives/helpers';
import {ExpenseCreatePage} from '../expense-create/expense-create';
import {GravatarPipe, MorePipe, LinebreaksPipe} from '../../pipes/pipes';

@Page({
    templateUrl: 'build/pages/expenses/expenses.html',
    pipes: [GravatarPipe, MorePipe, LinebreaksPipe],
})
export class ExpensesPage {
    LIMIT: number = 15;
    count: number;
    account: Object;
    is_empty: boolean;
    busy: boolean;
    params: any;
    pager: any;
    expenses: Array<any>;


    constructor(private nav: Nav, private dataProvider: DataProvider, private config: Config, private navParams: NavParams, private view: ViewController) {
        this.is_empty = false;
    }
    
    onPageLoaded() {
        this.params = this.navParams.data || {};
        this.pager = { page: 0 };
        this.params.account = { id: this.params.account_id || -1, name: this.params.account_name || this.config.getCurrent("user").account_name };
    }

onPageWillEnter()
    {
    if (this.params.account_name)
            this.view.setBackButtonText('');

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
        if (this.is_empty || this.count < this.LIMIT) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        this.getItems(infiniteScroll, null);
    }

    itemTapped(expense) {
        expense = expense || {};
        expense.account = expense.account || this.params.account;
        this.nav.push(ExpenseCreatePage, expense);
    }
    
    setDate(date, showmonth?, istime?) {
        if (date){
        //var time_offset = this.config.getCurrent("timezone_offset");     
        date = new Date(date.substring(0,23)+"Z");
        //date = new Date(date.setTime(date.getTime() + time_offset*60*60*1000)).toJSON();
        return getDateTime(date, showmonth, istime);
    }
     return null;
    }

    getCurrency(value) {
        return getCurrency(value);
    }
}
