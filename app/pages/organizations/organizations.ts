import {Page, Config, NavController} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {DashboardPage} from '../dashboard/dashboard';

@Page({
  templateUrl: 'build/pages/organizations/organizations.html',
})
export class OrganizationsPage {
    constructor(nav: NavController, toastr: ToastsManager, dataProvider: DataProvider, config: Config) {
    this.nav = nav;
        this.alert = toastr;
        this.config = config;
        this.dataProvider = dataProvider;
        this.list = {};
        
        this.dataProvider.getOrganizations(this.config.user.key).subscribe(
            data => {
                this.list = data;
            }, 
            error => { 
                console.log(error || 'Server error');}
        ); 
  }
    
    onSelectInst(event, instance) {
        console.log(instance);
        this.config.user.org = instance.org;
        this.config.user.instance = instance.inst;
        this.nav.setRoot(DashboardPage);
    }
}
