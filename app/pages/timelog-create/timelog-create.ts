import {Page, NavController, ViewController} from 'ionic-framework/ionic';

@Page({
  templateUrl: 'build/pages/timelog-create/timelog-create.html',
})
export class TimelogCreatePage {
    constructor(nav: NavController, private view: ViewController) {
    this.nav = nav;
        //this.view = view;
  }
    
    close() {
        this.view.dismiss();
    }
}
