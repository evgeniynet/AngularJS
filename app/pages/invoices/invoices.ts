import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {MorePipe} from '../../pipes/pipes';
import {InvoiceDetailsPage} from '../invoice-details/invoice-details';
import {InvoiceCreatePage} from '../invoice-create/invoice-create';
import {getDateTime, getCurrency} from '../../directives/helpers';

@Page({
  templateUrl: 'build/pages/invoices/invoices.html',
    pipes: [MorePipe],
})
export class InvoicesPage {

    LIMIT: number = 100;
    account: any;
    is_empty: boolean;
    unis_empty: boolean;
    busy: boolean;
    unbusy: boolean;
    params: any;
    pager: any;
    invoices: Array<any>;
    uninvoices: Array<any> = [];
    initial_load: boolean = true;
    details_tab: string;

    constructor(private nav: Nav, private dataProvider: DataProvider, private config: Config, private navParams: NavParams, private view: ViewController) {
        this.is_empty = false;
        this.unis_empty = false;
        this.invoices = [];
        this.uninvoices = [];
        console.log(this.navParams,"this.navParams");
  }

    onPageLoaded() {
        this.params = this.navParams.data || {};
        this.details_tab = "Ready";
        this.pager = { page: 0, limit: this.LIMIT };
        console.log(this.navParams,"this.navParams");
        if (!this.params.account) 
        this.params.account = { id: this.params.account_id || 0, name: this.params.account_name || this.config.getCurrent("user").account_name };

        var timer = setTimeout(() => {
                this.busy = true;
                this.unbusy = true;
            }, 500);

            this.getItems(timer);
            this.getItems(timer, true);
    }

    onPageWillEnter() {
        if (this.params.account.name)
            this.view.setBackButtonText('');
        if (!this.initial_load)
        {
            var timer = setTimeout(() => {
                let test=0;
            }, 500);
            setTimeout(() => {
               this.getItems(timer);
               this.getItems(timer, true);
            }, 1000);
        }
        this.initial_load = false;
    }


    getItems(timer, isbilled?) {
        this.dataProvider.getInvoices(this.params.account.id, isbilled || false, this.pager).subscribe(
            data => {
                    if (isbilled)
                    {
                    this.is_empty = !data.length;
                    this.busy = false;
                    this.invoices = data;
                    }
                    else
                    {
                        this.unis_empty = !data.length;
                    this.unbusy = false;
                    this.uninvoices = data;
                    }
                    clearTimeout(timer);
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
    
    itemTapped(item) {
        this.nav.push(InvoiceDetailsPage, item);
    }

    createInvoice() {
        this.nav.push(InvoiceCreatePage, this.params);
    }
    
    setDate(date, showmonth?, istime?) {
        if (date){
        var time_offset = this.config.getCurrent("timezone_offset");     
        date = new Date(date.substring(0,23)+"Z") || new Date();
        date = new Date(date.setTime(date.getTime() + time_offset*60*60*1000)).toJSON();
        return getDateTime(date, showmonth, istime);
    }
     return null;
    }
    
    getCurrency(value) {
        return getCurrency(value);
    }
}
