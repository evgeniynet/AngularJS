import {App, IonicApp, Config, Platform, NavController, NavParams, Events, MenuController} from 'ionic-angular';
//import {StatusBar} from 'ionic-native';
import {OnInit, OnDestroy} from 'angular2/core';
import {ApiData} from './providers/api-data';
import {DataProvider} from './providers/data-provider';
import {TicketProvider} from './providers/ticket-provider';
import {dontClearCache} from './providers/config';
import {MOCKS} from './providers/mocks';
import * as helpers from './directives/helpers';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {HelloIonicPage} from './pages/hello-ionic/hello-ionic';
import {ListPage} from './pages/list/list';
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
  providers: [ApiData, DataProvider, TicketProvider, ToastsManager],
  prodMode : false,
  config: {
    tabbarPlacement: 'top'
  }
})
class MyApp {
  
  pages: Array<any>;

  constructor(private app: IonicApp, private platform: Platform, private config: Config, private toastr: ToastsManager, private events: Events, private menu: MenuController, private ticketProvider: TicketProvider) {

    // set up our app
    this.initializeApp();

    config.alert = toastr;
    
    config.getCurrent = function(property) {
      let tconfig = this.current || JSON.parse(localStorage.current || "null") || {};
      if (!tconfig.stat)
        tconfig.stat = {};
      if (!tconfig.user)
        tconfig.user = {};
      if (!tconfig.recent)
        tconfig.recent = {};
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
      localStorage.current = JSON.stringify(this.getCurrent());
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

    // set our app's pages
    this.pages = [
    { title: 'Dashboard', component: DashboardPage, icon: "speedometer" },
    { title: 'Tickets', component: TicketsPage, icon: "create-outline" },
    { title: 'Timelogs', component: TimelogsPage, icon: "md-time" },
    { title: 'Accounts', component: AccountsPage, icon: "people" },
    { title: 'Invoices', component: InvoicesPage, icon: "card" },        
    { title: 'Queues', component: QueuesPage, icon: "list-box-outline" },
    { title: 'Switch Org', component: OrganizationsPage, icon: "md-swap" },
    { title: 'Signout', component: LoginPage, icon: "md-log-in" },
    { title: 'Full App', component: HelloIonicPage, icon: "md-share-alt" },
    ];

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

        if (config.current.user.is_techoradmin)
          this.rootPage = DashboardPage;
        else
          this.rootPage = TicketsPage; 
      }

      initializeApp() {
        this.platform.ready().then(() => {
          console.log('Platform ready');
        //this.testPage(AccountDetailsPage, MOCKS["accounts/-1"]);
      // The platform is now ready. Note: if this callback fails to fire, follow
      // the Troubleshooting guide for a number of possible solutions:
      //
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // First, let's hide the keyboard accessory bar (only works natively) since
      // that's a better default:
      //
      //
      // For example, we might change the StatusBar color. This one below is
      /* good for light backgrounds and dark text;
      if (window.StatusBar) {
        window.StatusBar.styleDefault();
      }
      */
    });
      }

      openPage(page, param) {
        this.menu.close();
    // close the menu when clicking a link from the menu
    let nav = this.app.getComponent('nav');

    if (page.index) {
          nav.setRoot(page.component || page, {tabIndex: page.index});/*.then(() => {
              // wait for the root page to be completely loaded
              // then close the menu
              this.app.getComponent('leftMenu').close();
            });*/
          } else {
          nav.setRoot(page.component || page);/*.then(() => {
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
    let nav = this.app.getComponent('nav');
    nav.push(page, param);
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
  }

  unsubscribeToEvents() {
    this.events.unsubscribe('login:failed', null);
  }

}
