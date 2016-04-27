import {Page, Config, NavController} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {saveCache} from '../../directives/helpers';
import {LoginPage} from '../login/login';
import {DashboardPage} from '../dashboard/dashboard';
import {TicketsPage} from '../tickets/tickets';

@Page({
    templateUrl: 'build/pages/organizations/organizations.html',
})
export class OrganizationsPage {

    list: Array<any>;

    constructor(private nav: NavController, private dataProvider: DataProvider, private config: Config) {
        //partly logout
        localStorage.clear();
        let he = this.config.getCurrent("user");
        if (he.email)
            localStorage.setItem("username", he.email);
        let key = this.config.getCurrent("key");
        this.config.clearCurrent();
        this.config.setCurrent({"key": key});
        this.config.saveCurrent();
        
        this.list = [];
        this.dataProvider.getOrganizations(key).subscribe(
            data => {
                
                this.list = data;
            }, 
            error => { 
                this.nav.alert(error || 'Server error', true);
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
        this.nav.alert(name + " has expired or inactivated. Contact SherpaDesk for assistance. Email: support@sherpadesk.com Phone: +1 (866) 996-1200, then press 2", true);
    }
    
    onSelectInst(instance) {
        this.config.setCurrent({ "org": instance.org, "instance": instance.inst });
        this.dataProvider.getConfig().subscribe(
            data => {
                this.config.setCurrent(data);
                this.config.saveCurrent();
                if (this.config.getCurrent("is_tech"))
                    this.nav.setRoot(DashboardPage);
                else
                    this.nav.setRoot(TicketsPage);     
            }, 
            error => { 
                this.nav.alert(error || 'Server error', true);
                let key = this.config.getCurrent("key");
                this.config.clearCurrent();
                this.config.setCurrent({ "key": key });
                this.config.saveCurrent();
                setTimeout(() => {
                    this.nav.setRoot(LoginPage);
                }, 3000);
                console.log(error || 'Server error');}
                ); 
    }
}
