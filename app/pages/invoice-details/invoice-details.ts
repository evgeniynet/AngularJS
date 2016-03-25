import {Page, NavController, NavParams, Config} from 'ionic-framework/ionic';
import {getCurrency} from '../../directives/helpers';

@Page({
  templateUrl: 'build/pages/invoice-details/invoice-details.html',
})
export class InvoiceDetailsPage {
    constructor(nav: NavController, navParams: NavParams, config : Config) {
    this.nav = nav;
        this.config = config;
        this.navParams = navParams;
        this.invoice = this.navParams.data;
  }
    
    setDate(date) {
        return new Date(date);
    }
    
    getCurrency(value) {
        return getCurrency(value, this.config.current.currency);
    }
}
