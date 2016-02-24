import {Page, ActionSheet, NavController} from 'ionic/ionic';
import {ActionButtonComponent} from '../../components/action-button/action-button';

@Page({
  templateUrl: 'build/pages/timelog/timelog.html',
    directives: [ActionButtonComponent]
})
export class TimelogPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}
