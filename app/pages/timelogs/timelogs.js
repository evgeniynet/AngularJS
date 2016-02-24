import {Page, ActionSheet, NavController} from 'ionic/ionic';
import {TimelogPage} from '../timelog/timelog';
import {ActionButtonComponent} from '../../components/action-button/action-button';

@Page({
  templateUrl: 'build/pages/timelogs/timelogs.html',
    directives: [ActionButtonComponent],
})
export class TimelogsPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
    itemTapped() {this.nav.push(TimelogPage);}
}
