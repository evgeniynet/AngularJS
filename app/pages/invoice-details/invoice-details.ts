import {Page, NavController} from 'ionic-framework/ionic';

@Page({
  templateUrl: 'build/pages/invoice-details/invoice-details.html',
})
export class InvoiceDetailsPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}