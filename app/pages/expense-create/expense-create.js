import {Page, NavController} from 'ionic/ionic';

@Page({
  templateUrl: 'build/pages/expense-create/expense-create.html',
})
export class ExpenseCreatePage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}
