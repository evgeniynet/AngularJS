import {Page, Config, NavController} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
import {DashboardPage} from '../dashboard/dashboard';
import {TicketsPage} from '../tickets/tickets';

@Page({
  templateUrl: 'build/pages/organizations/organizations.html',
})
export class OrganizationsPage {
    constructor(nav: NavController, dataProvider: DataProvider, config: Config) {
    this.nav = nav;
        this.config = config;
        this.alert = this.config.alert;
        this.dataProvider = dataProvider;
        this.list = [];
        this.dataProvider.getOrganizations(this.config.current.key).subscribe(
            data => {
                this.list = data;
            }, 
            error => { 
                this.alert.error(error || 'Server error', 'Oops!');
                //setTimeout(() => { this.nav.pop(); }, 3000);
                console.log(error || 'Server error');}
        ); 
  }
    
    toggle(org){
        var index = this.list.indexOf(org);
        for (let i=0; i< this.list.length; i++) {
            if (i == index)
                this.list[i].expanded = this.list[i].expanded ? false : true;
            else if (this.list[i].expanded)
                this.list[i].expanded = false;
        }
    }
    
    onSelectInst(event, instance) {
        this.config.current.org = instance.org;
        this.config.current.instance = instance.inst;
        localStorage.current = JSON.stringify(this.config.current);
        this.dataProvider.getConfig().subscribe(
            data => {
                let key = this.config.current.key;
                this.config.current = data;
                this.config.current.key = key;
                this.config.current.org = instance.org;
                this.config.current.instance = instance.inst;
                localStorage.current = JSON.stringify(this.config.current);
                if (this.config.current.user.is_techoradmin)
                this.nav.setRoot(DashboardPage);
                else
                    this.nav.setRoot(TicketsPage);     
            }, 
            error => { 
                this.alert.error(error || 'Server error', 'Oops!');
                setTimeout(() => {
                    this.nav.pop();
                }, 3000);
                console.log(error || 'Server error');}
        ); 
    }
}
