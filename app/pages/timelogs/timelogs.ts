import {Page, NavController} from 'ionic-framework/ionic';
import {TimelogPage} from '../timelog/timelog';
import {ActionButtonComponent} from '../../components/components';

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
