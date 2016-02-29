import {Page, NavController} from 'ionic-framework/ionic';
import {ActionButtonComponent} from '../../components/components';

@Page({
  templateUrl: 'build/pages/timelog/timelog.html',
    directives: [ActionButtonComponent]
})
export class TimelogPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}
