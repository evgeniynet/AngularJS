import {Page, Config, NavController} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {saveConfig} from '../../directives/helpers';
import {LoginPage} from '../login/login';
import {DashboardPage} from '../dashboard/dashboard';
import {TicketsPage} from '../tickets/tickets';

@Page({
    templateUrl: 'build/pages/organizations/organizations.html',
})
export class OrganizationsPage {
    constructor(nav: NavController, dataProvider: DataProvider, config: Config) {
        this.nav = nav;
        this.config = config;
        
        //partly logout
        localStorage.clear();
        if (this.config.current.user)
            localStorage.username = this.config.current.user.email;
        saveConfig(this.config.current, this.config.current.key);
        
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
        if (org.instances.length == 1)
        {
            this.onSelectInst({org: org.key, inst: org.instances[0].key});
            return;
        }
        var index = this.list.indexOf(org);
        for (let i=0; i< this.list.length; i++) {
            if (i == index)
                this.list[i].expanded = this.list[i].expanded ? false : true;
            else if (this.list[i].expanded)
                this.list[i].expanded = false;
        }
    }
    
    alertOrg(name){
        this.alert.error(name + " has expired or inactivated. Contact SherpaDesk for assistance. Email: support@sherpadesk.com Phone: +1 (866) 996-1200, then press 2", 'Oops!');
    }
    
    onSelectInst(instance) {
        this.config.current.org = instance.org;
        this.config.current.instance = instance.inst;
        this.dataProvider.getConfig().subscribe(
            data => {
                let key = this.config.current.key;
                this.config.current = data;
                saveConfig(this.config.current, key, instance.org, instance.inst);
                if (this.config.current.user.is_techoradmin)
                    this.nav.setRoot(DashboardPage);
                else
                    this.nav.setRoot(TicketsPage);     
            }, 
            error => { 
                this.alert.error(error || 'Server error', 'Oops!');
                setTimeout(() => {
                    this.nav.setRoot(TicketsPage);
                }, 3000);
                console.log(error || 'Server error');}
                ); 
    }
}
