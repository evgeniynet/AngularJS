import {Page, NavController, NavParams, Config} from 'ionic-angular';
import {getCurrency} from '../../directives/helpers';
import {GravatarPipe} from '../../pipes/pipes';

@Page({
  templateUrl: 'build/pages/invoice-details/invoice-details.html',
    pipes: [GravatarPipe],
})
export class InvoiceDetailsPage {
    constructor(private nav: NavController, private navParams: NavParams, private config: Config) {
        this.invoice = this.navParams.data || {};
  }
    close() {
        this.view.dismiss();
    }

    setDate(date) {
        return date ? new Date(date) : null;
    }
    
    getCurrency(value) {
        return getCurrency(value, this.config.current.currency);
    }
}
