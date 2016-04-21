import {Page, Config, NavController, NavParams} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {ActionButtonComponent} from '../../components/action-button/action-button';
import {MorePipe} from '../../pipes/pipes';
import {InvoiceDetailsPage} from '../invoice-details/invoice-details';
import {getCurrency} from '../../directives/helpers';

@Page({
  templateUrl: 'build/pages/invoices/invoices.html',
    directives: [ActionButtonComponent],
    pipes: [MorePipe],
})
export class InvoicesPage {

    LIMIT: number = 6;
    count: number;
    account: Object;
    is_empty: boolean;
    busy: boolean;
    params: Object;
    pager: Object;
    invoices: Array<any>;

    constructor(private nav: NavController, private dataProvider: DataProvider, private config: Config, private navParams: NavParams) {
        this.is_empty = false;
  }

    onPageLoaded() {
        this.params = this.navParams.data || {};
        this.pager = { page: 0, limit: this.LIMIT };
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
        this.dataProvider.getInvoices(this.params.account.id, this.pager).subscribe(
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
    
  setDate(date) {
        return date ? new Date(date) : null;
    }
    
    getCurrency(value) {
        return getCurrency(value, this.config.getCurrent("currency"));
    }
}
