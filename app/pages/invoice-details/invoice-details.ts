import {Page, Config, NavController, NavParams} from 'ionic-angular';
import {getCurrency} from '../../directives/helpers';
import {GravatarPipe} from '../../pipes/pipes';
import {DataProvider} from '../../providers/data-provider';
import {InvoicesPage} from '../invoices/invoices';

@Page({
  templateUrl: 'build/pages/invoice-details/invoice-details.html',
    pipes: [GravatarPipe],
})
export class InvoiceDetailsPage {

    invoice: any;

    constructor(private nav: NavController, private navParams: NavParams, private dataProvider: DataProvider, private config: Config) {
    }

    onPageLoaded() {
        this.invoice = this.navParams.data || {};
        //this.invoice.account = { id: this.params.account_id || 0, name: this.params.account_name || this.config.getCurrent("user").account_name };
        this.dataProvider.getInvoice(this.invoice.id, this.invoice.account_id, this.invoice.project_id).subscribe(
            data => {
                if (data.length == 1)
                    data = data[0];
                if (data.recipients)
                data.recipients = data.recipients.sort(function(a, b) {
                    return a.is_accounting_contact < b.is_accounting_contact ? 1 : -1;
                });
                this.invoice = data;
                    },
            error => {
                console.log(error || 'Server error');
            }
        );
  }

    setDate(date) {
        return date ? new Date(date) : new Date();
    }
    
    getCurrency(value) {
        return getCurrency(value, this.config.getCurrent("currency"));
    }

    send() {
        this.nav.alert('Hurray! Invoice sent :)');
        this.nav.popTo(this.nav.getByIndex(this.nav.length() - 3));
    }
}
