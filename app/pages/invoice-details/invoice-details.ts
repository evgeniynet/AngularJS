import {Page, Config, NavController, NavParams, Config} from 'ionic-angular';
import {getCurrency} from '../../directives/helpers';
import {GravatarPipe} from '../../pipes/pipes';
import {DataProvider} from '../../providers/data-provider';

@Page({
  templateUrl: 'build/pages/invoice-details/invoice-details.html',
    pipes: [GravatarPipe],
})
export class InvoiceDetailsPage {

    invoice: any;
    constructor(private nav: NavController, private navParams: NavParams, private dataProvider: DataProvider, private config: Config) {
        this.invoice = this.navParams.data || {};
        //this.invoice.account = { id: this.params.account_id || 0, name: this.params.account_name || this.config.getCurrent("user").account_name };
        
  }

    setDate(date) {
        return date ? new Date(date) : null;
    }
    
    getCurrency(value) {
        return getCurrency(value, this.config.getCurrent("currency"));
    }
}
