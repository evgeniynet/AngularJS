import {Page, Config, NavController, NavParams} from 'ionic-angular';
import {getCurrency} from '../../directives/helpers';
import {GravatarPipe} from '../../pipes/pipes';
import {DataProvider} from '../../providers/data-provider';
import {ApiData} from '../../providers/api-data';
import {InvoicesPage} from '../invoices/invoices';

@Page({
  templateUrl: 'build/pages/invoice-details/invoice-details.html',
    pipes: [GravatarPipe],
})
export class InvoiceDetailsPage {

    invoice: any;

    constructor(private nav: NavController, private navParams: NavParams, private dataProvider: DataProvider, private apiData: ApiData, private config: Config) {
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
        if (!this.invoice.recipients.filter(v => v.is_accounting_contact)) {
            this.nav.alert("No accounting contacts selected", false);
            return;
        }
        var emails = "";
        this.invoice.recipients.forEach((v) => {
            if (v.is_accounting_contact) { emails += v.email + ","; }
        });

        let data: any = {};

        if (!this.invoice.id) {
            data.status = "unbilled";
            data.account = this.invoice.account_id;
            data.project = this.invoice.project_id;
            data.start_date = this.setDate(this.invoice.start_date).toJSON();
            data.end_date = this.setDate(this.invoice.end_date).toJSON();
        }
        else
            data.action = "sendEmail";

        data.recipients = emails;

        this.apiData.get('invoices/' + (this.invoice.id || ""), data, !this.invoice.id ? 'POST' : 'PUT').subscribe(
                data => {
                    this.nav.alert('Hurray! Invoice sent :)');
                    if (!this.invoice.id)
                        this.nav.popTo(this.nav.getByIndex(this.nav.length() - 3));
                    else
                        this.nav.pop();
                },
                error => {
                    console.log(error || 'Server error');
                }
            );
    }
}
