import {Page, NavController, NavParams, Config} from 'ionic-angular';
import {getCurrency} from '../../directives/helpers';
import {GravatarPipe} from '../../pipes/pipes';

@Page({
  templateUrl: 'build/pages/invoice-details/invoice-details.html',
    pipes: [GravatarPipe],
})
export class InvoiceDetailsPage {
    constructor(nav: NavController, navParams: NavParams, config : Config) {
    this.nav = nav;
        this.config = config;
        this.navParams = navParams;
        this.invoice = this.navParams.data;
  }
    
    setDate(date) {
        return date ? new Date(date) : null;
    }
    
    getCurrency(value) {
        return getCurrency(value, this.config.current.currency);
    }
}
