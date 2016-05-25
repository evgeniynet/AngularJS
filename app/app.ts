import {NgZone, ViewChild} from '@angular/core';
import {App, IonicApp, Config, Platform, Nav, NavParams, Events, MenuController, Toast} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {OnInit, OnDestroy} from '@angular/core';
import {ApiData} from './providers/api-data';
import {DataProvider} from './providers/data-provider';
import {TicketProvider} from './providers/ticket-provider';
import {TimeProvider} from './providers/time-provider';
import {AppSite, dontClearCache} from './providers/config';
import {MOCKS} from './providers/mocks';
import * as helpers from './directives/helpers';
import {QueuesPage} from './pages/queues/queues';
import {InvoicesPage} from './pages/invoices/invoices';
import {AccountsPage} from './pages/accounts/accounts';
import {AccountDetailsPage} from './pages/account-details/account-details';
import {TimelogsPage} from './pages/timelogs/timelogs';
import {TimelogPage} from './pages/timelog/timelog';
import {TicketsPage} from './pages/tickets/tickets';
import {TicketCreatePage, CloseTicketModal, AddUserModal} from './pages/modals/modals';
import {DashboardPage} from './pages/dashboard/dashboard';
import {OrganizationsPage} from './pages/organizations/organizations';
import {LoginPage} from './pages/login/login';
import {ExpenseCreatePage} from './pages/expense-create/expense-create';
import {ExpensesPage} from './pages/expenses/expenses';

export interface Settings {
  is_tech: boolean;
  stat: Object;
  key: string;
  org: string;
  instance: string;
  user: Object;
  recent: Object;
}

export interface Stat {
  accounts: Object;
  tickets: Object;
}

@App({
  templateUrl: 'build/app.html',
  providers: [ApiData, DataProvider, TicketProvider, TimeProvider],
  prodMode : true,
  config: {
    tabbarPlacement: 'top'
  }
})
class MyApp {

  @ViewChild(Nav) nav: Nav;
  pages: Array<any>;
  rootPage: any;

  constructor(private app: IonicApp, private platform: Platform, private config: Config, private events: Events, private menu: MenuController, private ticketProvider: TicketProvider) {

    // set up our app
    this.initializeApp();
    
    config.getCurrent = function(property) {
      let tconfig = this.current || JSON.parse(localStorage.getItem("current") || "null") || {};
      if (!tconfig.stat)
        tconfig.stat = {};
      if (!tconfig.user)
        tconfig.user = {};
      if (!tconfig.recent)
        tconfig.recent = {};
      tconfig.is_tech = tconfig.is_tech || tconfig.user.is_techoradmin || false; 
      if (property)
        return tconfig[property] || "";
      return tconfig; 
    };

    config.setCurrent = function(nconfig) {
      let tconfig = nconfig || {};
      tconfig.user = nconfig.user || this.current.user || {};
      tconfig.is_tech = nconfig.is_tech || tconfig.user.is_techoradmin || false; 
      tconfig.stat = nconfig.stat || this.current.stat || {};
      tconfig.recent = nconfig.recent || this.current.recent || {};
      tconfig.key = nconfig.key || this.current.key || "";
      tconfig.org = nconfig.org || this.current.org || "";
      tconfig.instance = nconfig.instance || this.current.instance || "";
      this.current = tconfig;
      //this.saveCurrent();
      return tconfig;
    };

    config.clearCurrent = function(config) {
      this.current = {user: {}, stat: {}, recent: {}};
      return config;
    };

    config.saveCurrent = function(){
      let curr = this.getCurrent();
      localStorage.setItem("current",  JSON.stringify(curr));
      localStorage.setItem("dateformat", curr.user.date_format);
      localStorage.setItem('timeformat', curr.user.time_format);
      localStorage.setItem('currency', curr.currency || "$");
    }

    config.getStat = function(property){
      let stat = this.getCurrent("stat")[property];
      if (typeof stat == "undefined")
        return -1;
      return stat || {};
    }

    config.setStat = function(property, value){
      this.current.stat[property]  = value;
    }

    config.getRecent = function(property){
      let recent = this.getCurrent("recent")[property];
      if (typeof recent == "undefined")
        return -1;
      return recent || {};
    }

    config.setRecent = function(property, value){
      this.current.recent[property]  = value;
    }

    config.current = config.getCurrent();

        //set test config object
        if (dontClearCache)
          config.current = config.setCurrent(MOCKS["config"]);
        else if (!config.current.key)
        {
          this.rootPage = LoginPage;
          return;
        }

        if (!config.current.org || !config.current.instance)
        {
          this.rootPage = OrganizationsPage;
          return;
        }

        config.saveCurrent();

        // set first pages
        //this.rootPage = HelloIonicPage; return;
        //this.rootPage = TicketsPage; return;
        //this.rootPage = ExpensesPage; return;
        //this.rootPage = ExpenseCreatePage; return;
        //this.rootPage = TimelogsPage; return;
        //this.rootPage = TimelogPage; return;
        //this.rootPage = AccountsPage; return;
        //this.rootPage = TicketCreatePage; return;
        //this.rootPage = AddUserModal; return;

        // set our app's pages
        if (config.current.is_tech) 
          this.pages = [
        { title: 'Dashboard', component: DashboardPage, icon: "speedometer", is_active: true },
        { title: 'Tickets', component: TicketsPage, icon: "create", is_active: true },
        { title: 'Timelogs', component: TimelogsPage, icon: "md-time", is_active: config.current.is_time_tracking },
        { title: 'Accounts', component: AccountsPage, icon: "people", is_active: config.current.is_account_manager },
        { title: 'Invoices', component: InvoicesPage, icon: "card", is_active: config.current.is_time_tracking && config.current.is_invoice },
        { title: 'Queues', component: QueuesPage, icon: "list-box", is_active: config.current.is_unassigned_queue },
        { title: 'Switch Org', component: OrganizationsPage, icon: "md-swap", is_active: true },
        { title: 'Signout', component: LoginPage, icon: "md-log-in", is_active: true },
        { title: 'Full App', component: null, icon: "md-share-alt", is_active: true },
        ];
        else
          this.pages = [
        { title: 'Tickets', component: TicketsPage, icon: "create", is_active: true },
        { title: 'Switch Org', component: OrganizationsPage, icon: "md-swap", is_active: true },
        { title: 'Signout', component: LoginPage, icon: "md-log-in", is_active: true },
        { title: 'Full App', component: null, icon: "md-share-alt", is_active: true },
        ];

        if (config.current.is_tech)
        {
          this.rootPage = DashboardPage;
        }
        else {
          this.rootPage = TicketsPage; 
        }
      }

      initializeApp() {
        this.platform.ready().then(() => {
          //console.log('Platform ready');

          StatusBar.styleDefault();
          //StatusBar.overlaysWebView(false);

          this.nav.alert = function(message, isNeg) {
            let toast = Toast.create({
              message: message,
              duration: 3000,
              cssClass: isNeg ? "toast-error" : "toast-ok"
            });

            toast.onDismiss(() => {
        //console.log('Dismissed toast');
      });
            this.present(toast);
          };
        });
      }

      openPage(page, param?) {
        this.menu.close();

        //if null open new tab
        if (!page.component)
        {
          let curr = this.config.getCurrent();
          let url = helpers.fullapplink(AppSite, "", curr.instance, curr.org);
          window.open(url, "_blank");
          return;
        }
    // close the menu when clicking a link from the menu

    if (page.index) {
          this.nav.setRoot(page.component || page, {tabIndex: page.index});/*.then(() => {
              // wait for the root page to be completely loaded
              // then close the menu
              this.app.getComponent('leftMenu').close();
            });*/
          } else {
          this.nav.setRoot(page.component || page);/*.then(() => {
              // wait for the root page to be completely loaded
              // then close the menu
              this.app.getComponent('leftMenu').close();
            });*/
          }
      /*
      let nav = this.app.getComponent('nav');
      nav.setRoot(page.component, param).then(() => {
          // wait for the root page to be completely loaded
          // then close the menu
          this.app.getComponent('leftMenu').close();
        });*/
      }

      testPage(page, param) {
    // close the menu when clicking a link from the menu

    this.nav.push(page, param);
  }

  ngOnInit() {
    this.subscribeToEvents();
  }

  ngOnDestroy() {
    this.unsubscribeToEvents();
  }

  subscribeToEvents() {
    this.events.subscribe('login:failed', () => {
      this.openPage(LoginPage);
            //this.getNav().setRoot(TodosPage);
          });
    this.events.subscribe('connection:error', (data) => {
    this.nav.alert(data, true);
          });
  }

  unsubscribeToEvents() {
    this.events.unsubscribe('login:failed', null);
    this.events.unsubscribe('connection:error', null);
  }

}
