import {Page, NavController} from 'ionic/ionic';

@Page({
  templateUrl: 'build/pages/organizations/organizations.html',
})
export class OrganizationsPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}
