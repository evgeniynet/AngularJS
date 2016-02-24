import {Page, ActionSheet, NavController} from 'ionic/ionic';
import {InvoiceDetailsPage} from '../invoice-details/invoice-details';
import {ActionButtonComponent} from '../../components/action-button/action-button';

@Page({
  templateUrl: 'build/pages/invoices/invoices.html',
    directives: [ActionButtonComponent]
})
export class InvoicesPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
    itemTapped() {this.nav.push(InvoiceDetailsPage);}
}
