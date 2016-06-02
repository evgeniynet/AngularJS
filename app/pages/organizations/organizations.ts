import {Page, Config, Nav, Events} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {saveCache} from '../../directives/helpers';
import {LoginPage} from '../login/login';
import {DashboardPage} from '../dashboard/dashboard';
import {TicketsPage} from '../tickets/tickets';

@Page({
    templateUrl: 'build/pages/organizations/organizations.html',
})
export class OrganizationsPage {

    list: Array<any> = [];

    constructor(private nav: Nav, private dataProvider: DataProvider, private config: Config, private events: Events) {
        //partly logout
        localStorage.clear();
        this.config.current.org = "";
        this.config.saveCurrent();
        
        this.dataProvider.getOrganizations(this.config.getCurrent("key")).subscribe(
            data => {
                if (data.length == 1)
                {
                    if (data.instances.length == 1)
                        this.onSelectInst({ org: data.key, inst: data.instances[0].key });
                    else
                    {
                        this.list = data;
                        this.toggle(data[0]);
                    }
                }
                else
                    this.list = data;
            }, 
            error => { 
                this.nav.alert("Cannot get list of Organizations", true);
        localStorage.clear();
        this.nav.setRoot(LoginPage, null, { animation: "wp-transition" });
                }
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
        this.config.saveCurrent();
        this.events.publish("config:get", true);
    }
}
