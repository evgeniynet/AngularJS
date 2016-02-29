import {Page, NavController} from 'ionic-framework/ionic';

@Page({
  templateUrl: 'build/pages/timelog-create/timelog-create.html',
})
export class TimelogCreatePage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}
