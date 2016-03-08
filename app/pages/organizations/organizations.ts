import {Page, Config, NavController} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
import {DashboardPage} from '../dashboard/dashboard';

@Page({
  templateUrl: 'build/pages/organizations/organizations.html',
})
export class OrganizationsPage {
    constructor(nav: NavController, dataProvider: DataProvider, config: Config) {
    this.nav = nav;
        this.config = config;
        this.alert =         this.config.alert;
        this.dataProvider = dataProvider;
        this.list = {};
        
        this.dataProvider.getOrganizations(this.config.current.key).subscribe(
            data => {
                this.list = data;
            }, 
            error => { 
                console.log(error || 'Server error');}
        ); 
  }
    
    onSelectInst(event, instance) {
        console.log(instance);
        this.config.current.org = instance.org;
        this.config.current.instance = instance.inst;
        this.nav.setRoot(DashboardPage);
    }
}
