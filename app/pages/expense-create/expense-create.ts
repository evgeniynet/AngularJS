import {Page, NavController} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/expense-create/expense-create.html',
})
export class ExpenseCreatePage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}
