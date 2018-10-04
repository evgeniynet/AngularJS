import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
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

    constructor(private nav: Nav, private navParams: NavParams, private dataProvider: DataProvider, private apiData: ApiData, private config: Config, private view: ViewController) {
    }

    onPageLoaded() {
        this.invoice = this.navParams.data || {};
        if (this.invoice.id)
        this.title = `Send Invoice #${this.invoice.id} to\u00a0${this.invoice.account_name}`;
        else 
            this.title = `Create Invoice on\u00a0${this.invoice.account_name}`;

        //this.invoice.account = { id: this.params.account_id || 0, name: this.params.account_name || this.config.getCurrent("user").account_name };
        this.dataProvider.getInvoice(this.invoice.id, this.invoice.account_id, this.invoice.contract_id).subscribe(
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

  onPageWillEnter() {
            this.view.setBackButtonText('');
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

    changeContact(recipient) {
        recipient.is_accounting_contact = !recipient.is_accounting_contact;
    }

    send() {
        if (!this.invoice.recipients.filter(v => v.is_accounting_contact).length) {
            this.nav.alert("No accounting contacts selected", true);
            return;
        }
        //proof double click
            if (this.invoice.in_progress && Date.now() - this.invoice.in_progress < 1500) {return;}
            this.invoice.in_progress = Date.now();
            
        var emails = "";
        this.invoice.recipients.forEach((v) => {
            if (v.is_accounting_contact) { emails += v.email + ","; }
        });

        let data: any = {};

        if (!this.invoice.id) {
            data.status = "unbilled";
            data.account = this.invoice.account_id;
            data.contract_id = this.invoice.contract_id;
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
                    this.nav.alert(error, true);
                    console.log(error || 'Server error');
                }
            );
    }
}
