import {Page, Config, NavController} from 'ionic-angular';
import {InvoiceDetailsPage} from '../invoice-details/invoice-details';
import {DataProvider} from '../../providers/data-provider';
import {getCurrency} from '../../directives/helpers';
import {ActionButtonComponent} from '../../components/action-button/action-button';
import {MorePipe} from '../../pipes/pipes';

@Page({
  templateUrl: 'build/pages/invoices/invoices.html',
    directives: [ActionButtonComponent],
    pipes: [MorePipe],
})
export class InvoicesPage {
    constructor(private nav: NavController, private dataProvider: DataProvider, private config: Config) {
        this.is_empty = false;
  }
    
    onPageLoaded()
    {
        let pager = {limit: 25};

        this.dataProvider.getInvoices(null, pager).subscribe(
            data => {this.invoices = data;
                     this.is_empty = !data || data.length == 0;}, 
            error => { 
                console.log(error || 'Server error');}
        );
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
