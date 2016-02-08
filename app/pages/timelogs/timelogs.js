import {Page, NavController} from 'ionic/ionic';
import {TimelogPage} from '../timelog/timelog';

/*
  Generated class for the TimelogsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/timelogs/timelogs.html',
})
export class TimelogsPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
    itemTapped() {this.nav.push(TimelogPage);}
}
