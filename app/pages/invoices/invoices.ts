import {Page, Config, NavController} from 'ionic-framework/ionic';
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
    constructor(nav: NavController, dataProvider: DataProvider, config: Config) {
    this.nav = nav;
        this.config = config;
        this.is_empty = false;
        this.dataProvider = dataProvider;
        let pager = {limit: 5};

        this.dataProvider.getInvoices(null, pager).subscribe(
            data => {this.invoices = data;
                     this.is_empty = !data || data.length == 0;}, 
            error => { 
                console.log(error || 'Server error');}
        );
  }
    itemTapped() {this.nav.push(InvoiceDetailsPage);}
    
     setDate(date) {
      return new Date(date);
  }
}
