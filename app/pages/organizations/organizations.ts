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
        localStorage.removeItem("current");
        this.config.current.org = "";
        this.ticketProvider._dataStore = {all: [],alt: [],tech: [],user: []};
        this.dataProvider._dataStore = this.timeProvider._dataStore = {};
        this.config.saveCurrent();
        //clear also chrome ext if needed
        if (localStorage.getItem("isExtension") === "true")
            window.top.postMessage("logout", "*");
        
        this.dataProvider.getOrganizations(this.config.getCurrent("key")).subscribe(
            data => {
                this.config.current.is_multiple_org = true;
                if (data.length == 1)
                {
                    if (data[0].instances.length == 1)
                    {
                        this.config.current.is_multiple_org = false;
                        this.onSelectInst({ org: data[0].key, inst: data[0].instances[0].key });
                    }
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
                localStorage.removeItem("current");
                this.nav.setRoot(LoginPage, null, { animation: "wp-transition" });
            }
            ); 
    }

    onPageLoaded()
    {
      document.title = "Organizations : " + document.title ;  
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
        this.config.current.org = instance.org;
        this.config.current.instance = instance.inst;
        this.config.saveCurrent();
        this.events.publish("config:get", true);
    }
}
