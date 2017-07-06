import {Page, Modal, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {getDateTime, getCurrency} from '../../directives/helpers';
import {GravatarPipe} from '../../pipes/pipes';
import {DataProvider} from '../../providers/data-provider';
import {ApiData} from '../../providers/api-data';
import {InvoicesPage} from '../invoices/invoices';
import {InfinitySelectModal} from '../modals/modals';

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
        this.dataProvider.getInvoice(this.invoice.id, this.invoice.account_id, this.invoice.project_id).subscribe(
            data => {
              
                if (data.length == 1)
                    data = data[0];
                if (data.recipients)
                    //console.log(data.recipients, data);
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
   addRecipientsButton() {
    console.log("Function connect");
    let myModal = Modal.create(InfinitySelectModal,{
                            hidden :false,
                            items: [],
                            name:"User",
                            selected:9032,
                            url:"users",
                            value:"1NN Test "});
        myModal.onDismiss(data1 => {
            console.log(data1);
            var RegN= /\(/;
            var RegM= /\)/;
            var N=data1.name.search(RegN);
            var M=data1.name.search(RegM);
            data1.fullname=data1.name.substring(0,N);
            data1.email=data1.name.substring(N+1,M);
            data1.is_accounting_contact=true;
            //console.log(data1.fullname, data1.email);
            this.invoice.recipients.unshift (data1);
            
            
        });
        this.nav.present(myModal);
            }
  onPageWillEnter() {
            this.view.setBackButtonText('');
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
