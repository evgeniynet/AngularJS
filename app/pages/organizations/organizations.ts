import {Page, NavController} from 'ionic-framework/ionic';
import {DashboardPage} from '../dashboard/dashboard';

@Page({
  templateUrl: 'build/pages/organizations/organizations.html',
})
export class OrganizationsPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
    
    onSelectInst(event, instance) {
        console.log(instance);
        this.nav.setRoot(DashboardPage);
    }
}
