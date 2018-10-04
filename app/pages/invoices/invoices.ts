import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {MorePipe} from '../../pipes/pipes';
import {InvoiceDetailsPage} from '../invoice-details/invoice-details';
import {UnInvoicesPage} from '../uninvoices/uninvoices';
import {getDateTime, getCurrency} from '../../directives/helpers';

@Page({
  templateUrl: 'build/pages/invoices/invoices.html',
    pipes: [MorePipe],
})
export class InvoicesPage {

    LIMIT: number = 15;
    count: number;
    account: any;
    is_empty: boolean;
    busy: boolean;
    params: any;
    pager: any;
    invoices: Array<any>;
    initial_load: boolean = true;

    constructor(private nav: Nav, private dataProvider: DataProvider, private config: Config, private navParams: NavParams, private view: ViewController) {
        this.is_empty = false;
        this.invoices = [];
  }

    onPageLoaded() {
        this.params = this.navParams.data || {};
        this.pager = { page: 0, limit: this.LIMIT };
        this.params.account = { id: this.params.account_id || 0, name: this.params.account_name || this.config.getCurrent("user").account_name };
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

    onPageWillEnter() {
        if (this.params.account_name)
            this.view.setBackButtonText('');
        if (!this.initial_load)
        {
            var timer = setTimeout(() => {
                let test=0;
            }, 500);
            setTimeout(() => {
               this.getItems(null, timer);;
            }, 1000);
        }
        this.initial_load = false;
    }


    getItems(infiniteScroll, timer) {
        this.dataProvider.getInvoices(this.params.account.id, true, this.pager).subscribe(
            data => {
                if (timer) {
                    this.is_empty = !data.length;
                    clearTimeout(timer);
                    this.busy = false;
                    this.invoices = data;
                }
                else
                    this.invoices.push(...data);
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
    
    itemTapped(item) {
        this.nav.push(InvoiceDetailsPage, item);
    }

    showUninvoiced() {
        this.nav.push(UnInvoicesPage, this.params);
    }
    
    setDate(date, showmonth?, istime?) {
        if (date){
        var time_offset = this.config.getCurrent("timezone_offset");     
        date = new Date(date.substring(0,23)) || new Date();
        date = new Date(date.setTime(date.getTime() + time_offset*60*60*1000)).toJSON();
        return getDateTime(date, showmonth, istime);
    }
     return null;
    }
    
    getCurrency(value) {
        return getCurrency(value);
    }
}
