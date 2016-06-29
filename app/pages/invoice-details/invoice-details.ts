import {Page, Config, Nav, NavParams} from 'ionic-angular';
import {getDateTime, getCurrency} from '../../directives/helpers';
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
    title: string;

    constructor(private nav: Nav, private navParams: NavParams, private dataProvider: DataProvider, private apiData: ApiData, private config: Config) {
    }

    onPageLoaded() {
        this.invoice = this.navParams.data || {};
        if (this.invoice.id)
        this.title = `Send Invoice #${this.invoice.id} to ${this.invoice.account_name}`;
        else 
            this.title = `Create Invoice @ ${this.invoice.account_name}`;

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

    setDate(date, showmonth?, istime?) {
        return getDateTime(date || new Date(), showmonth, istime);
    }
    
    getCurrency(value) {
        return getCurrency(value);
    }

    changeContact(recipient) {
        recipient.is_accounting_contact = !recipient.is_accounting_contact;
    }

    send() {
        if (!this.invoice.recipients.filter(v => v.is_accounting_contact).length) {
            this.nav.alert("No accounting contacts selected", true);
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
            data.start_date = (new Date(this.invoice.start_date || Date.now().toString())).toJSON();
            data.end_date = (new Date(this.invoice.end_date || Date.now().toString())).toJSON();
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
