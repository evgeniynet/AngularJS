import {Page, Config, Nav, Events, Loading} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {TicketProvider} from '../../providers/ticket-provider';
import {TimeProvider} from '../../providers/time-provider';
import {Site, isSD} from '../../providers/config';
import {openURLsystem} from '../../directives/helpers';
import {LoginPage} from '../login/login';
import {DashboardPage} from '../dashboard/dashboard';
import {TicketsPage} from '../tickets/tickets';

@Page({
    templateUrl: 'build/pages/organizations/organizations.html',
})
export class OrganizationsPage {

    list: Array<any> = [];

    constructor(private nav: Nav, private dataProvider: DataProvider, private config: Config, private events: Events, private ticketProvider: TicketProvider, private timeProvider: TimeProvider) {
        //partly logout
        var key = this.config.getCurrent("key");
        events.publish("app:logout", key);
        this.ticketProvider._dataStore = {all: [],alt: [],tech: [],user: []};
        this.dataProvider._dataStore = this.timeProvider._dataStore = {};
        //this.config.saveCurrent();
        //clear also chrome ext if needed
        if (localStorage.getItem("isExtension") === "true")
            window.top.postMessage("logout", "*");
        
        this.dataProvider.getOrganizations(key).subscribe(
            data => {
                var org = localStorage.getItem('loadOrgKey') || '';
                if (org) localStorage.setItem('loadOrgKey', "");
                var org_data = org ? data.filter(t=> t.key == org) : null;
                if (org_data)
                    data = org_data;
                
                if (data.length == 1)
                {
                    if (data[0].instances.length == 1)
                    {
                        this.config.setCurrent({is_multiple_org : false});
                        this.onSelectInst({ org: data[0].key, inst: data[0].instances[0].key });
                        return;
                    }
                    else
                    {
                        this.list = data;
                        this.toggle(data[0], 0);
                    }
                }
                else
                    this.list = data;
                this.config.setCurrent({is_multiple_org : true});
            }, 
            error => { 
                this.nav.alert("Cannot get list of Organizations", true);
                this.config.clearCurrent();
                this.nav.setRoot(LoginPage, null, { animation: "wp-transition" });
            }
            ); 
    }

    onPageLoaded()
    {
      document.title = "Organizations : " + document.title ;  
    }

    toggle(org, index){
        if (org.instances.length == 1)
        {
            this.onSelectInst({org: org.key, inst: org.instances[0].key});
            return;
        }
        //this.list = this.list.map(o => {o.expanded = false; return o;});
        this.list.forEach((o, i) => o.expanded = false);
        this.list[index].expanded = this.list[index].expanded ? false : true;
    }
    
    support()
    {
        openURLsystem(`https://support.${Site}portal/`);
    }
    
    alertOrg(name){
        this.nav.alert(name + " has expired or inactivated. Contact SherpaDesk for assistance. Email: support@sherpadesk.com Phone: +1 (866) 996-1200, then press 2", true);
    }
    
    onSelectInst(instance) {
        let loading = Loading.create({
            content: "Loading configuration...",
                duration: 3000,
                dismissOnPageChange: true
            });
        this.nav.present(loading);
        this.config.setCurrent({ org : instance.org, instance : instance.inst});
        this.events.publish("config:get", true);
    }
}
