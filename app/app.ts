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
import {SignupPage} from './pages/signup/signup';
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
    tabbarPlacement: 'top',
    pageTransitionDelay: 0,
    prodMode: true,
    activator: "ripple",
    ios: {
      activator: 'ripple'
    } 
  }
})
class MyApp {

  @ViewChild(Nav) nav: Nav;
  pages: Array<any>;
  rootPage: any;

  constructor(private app: IonicApp, private platform: Platform, private config: Config, private events: Events, private menu: MenuController, private ticketProvider: TicketProvider, private dataProvider: DataProvider) {

    if (!this.isStorage())
    {
      console.log("Please enable coockies!")
       return;
    }

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
      tconfig.isPhonegap = tconfig.isPhonegap || false; 
      tconfig.isExtension = tconfig.isExtension || false; 
      tconfig.isGoogle = tconfig.isGoogle || false; 
      tconfig.is_multiple_org = tconfig.is_multiple_org || false; 
      tconfig.username = tconfig.username || false; 
      if (property)
        return tconfig[property] || "";
      return tconfig; 
    };

    config.setCurrent = function(nconfig) {
      let tconfig = nconfig || {};
      let current = this.current || {};
      tconfig.user = nconfig.user || current.user || {};
      tconfig.is_tech = nconfig.is_tech || nconfig.user.is_techoradmin || false; 
      tconfig.isPhonegap = nconfig.isPhonegap || current.isPhonegap || false; 
      tconfig.isExtension = nconfig.isExtension || current.isExtension || false; 
      tconfig.isGoogle = nconfig.isGoogle || current.isGoogle || false; 
      tconfig.is_multiple_org = nconfig.is_multiple_org || current.is_multiple_org || false; 
      tconfig.username = nconfig.username || current.username || false; 
      tconfig.stat = nconfig.stat || current.stat || {};
      tconfig.recent = nconfig.recent || current.recent || {};
      tconfig.key = nconfig.key || current.key || "";
      tconfig.org = nconfig.org || current.org || "";
      tconfig.instance = nconfig.instance || current.instance || "";
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
      localStorage.setItem("dateformat", curr.user.date_format || 0);
      localStorage.setItem('timeformat', curr.user.time_format || 0);
      localStorage.setItem('currency', curr.currency || "$");
      localStorage.setItem('isPhonegap', curr.isPhonegap || "");
      localStorage.setItem('isExtension', curr.isExtension || "");
      localStorage.setItem('isGoogle', curr.isGoogle || "");
      localStorage.setItem('username', curr.username || "");
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

    setTimeout(() =>
      this.nav.alert = function(message, isNeg) {
        let toast = Toast.create({
          message: message,
          duration: isNeg ? 7000 : 3000,
          cssClass: isNeg ? "toast-error" : "toast-ok",
          showCloseButton: isNeg,
          closeButtonText: "X"
        });
        //toast.onDismiss(() => {
          //console.log('Dismissed toast');
        //});
        this.present(toast);
      }, 0);

    //this.rootPage = SignupPage; return;
    config.current = config.getCurrent();
    config.setCurrent({ "isPhonegap": localStorage.getItem("isPhonegap") === "true", "isExtension" : window.self !== window.top });

    var key = helpers.getParameterByName('t');
    var email = helpers.getParameterByName('e');
    var platform_string = helpers.getParameterByName('ionicPlatform');

    if (key) {
      helpers.cleanQuerystring('ionicPlatform', platform_string);
      localStorage.clear();
      //config.clearCurrent();
      config.setCurrent({ "key": key, "isGoogle": true, "username": email.replace("#", "") });
      config.saveCurrent();
      this.rootPage = OrganizationsPage;
      return;
    }
    else {
      var error = helpers.getParameterByName('f');
      if (error) {
        helpers.cleanQuerystring('ionicPlatform', platform_string);
        setTimeout(() => this.nav.alert(error, true), 3000);
      }
    }

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

        //config.saveCurrent();

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
        setInterval(() => this.redirect(), 2 * 60 * 1000);

        setTimeout(() => this.redirect(true), dontClearCache ? 1000 : 0);
      }

  redirect(isRedirect?) {
    this.dataProvider.getConfig().subscribe(
      data => {
        //Time
        data.is_time_tracking = false;
        //Resolution on close ticket
        data.is_resolution_tracking = false;
        //Confirmation on close ticket
        data.is_confirmation_tracking = false;
        //Priorities
        data.is_priorities_general = false;
        //Locations
        data.is_location_tracking = false;
        //Expenses
        data.is_expenses = false;
        //Classes
        data.is_class_tracking = false;
        //Invoices
        data.is_invoice = false;
        //Projects
        data.is_project_tracking = false;
        //Levels
        data.is_ticket_levels = false;
        //Accounts
        data.is_account_manager = false;
        //Queues
        data.is_unassigned_queue = false;
        //All Open tickets (true to hide)
        data.is_limit_assigned_tkts = true;

        this.config.setCurrent(data);
        this.config.saveCurrent();
        // set our app's pages
        if (this.config.current.is_tech)
          this.pages = [
            { title: 'Dashboard', component: DashboardPage, icon: "speedometer", is_active: true },
            { title: 'Tickets', component: TicketsPage, icon: "create", is_active: true },
            { title: 'Timelogs', component: TimelogsPage, icon: "md-time", is_active: this.config.current.is_time_tracking },
            { title: 'Accounts', component: AccountsPage, icon: "people", is_active: this.config.current.is_account_manager },
            { title: 'Invoices', component: InvoicesPage, icon: "card", is_active: this.config.current.is_time_tracking && this.config.current.is_invoice },
            { title: 'Queues', component: QueuesPage, icon: "list-box", is_active: this.config.current.is_unassigned_queue },
            { title: 'Switch Org', component: OrganizationsPage, icon: "md-swap", is_active: this.config.current.is_multiple_org },
            { title: 'Signout', component: LoginPage, icon: "md-log-in", is_active: true },
            { title: 'Full App', component: null, icon: "md-share-alt", is_active: true },
          ];
        else
          this.pages = [
            { title: 'Tickets', component: TicketsPage, icon: "create", is_active: true },
            { title: 'Switch Org', component: OrganizationsPage, icon: "md-swap", is_active: this.config.current.is_multiple_org },
            { title: 'Signout', component: LoginPage, icon: "md-log-in", is_active: true },
            { title: 'Full App', component: null, icon: "md-share-alt", is_active: true },
          ];

        //if (this.config.current.isPhonegap && this.config.current.key)
        //  initOrgPreferences(this.config.current.org + "-" + this.config.current.instance + ":" + this.config.current.key);
        //getInfo4Extension();

        if (isRedirect) {
          if (this.config.current.is_tech) {
            this.nav.setRoot(DashboardPage, null, { animation: "wp-transition" });
          }
          else {
            this.nav.setRoot(TicketsPage, null, { animation: "wp-transition" });
          }
        }
      },
      error => {
        //console.log(this.nav);
        this.nav.alert(error || 'Server error', true);
        this.config.current.org = "";
        //localStorage.clear();
        //localStorage.setItem("username", this.config.current.username || "");
        //this.nav.setRoot(LoginPage, null, { animation: "wp-transition" });
      }
    ); 
  }

isStorage() {
    var mod = 'modernizr';
    try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch(e) {
      let toast = Toast.create({
        message: "Please enable Cookies to work with site!",
        enableBackdropDismiss: false,
        showCloseButton: true,
        cssClass: "toast-error"
      });
      this.nav.present(toast);
        return false;
    }
}

initializeApp() {
  this.platform.ready().then(() => {
    if (localStorage.getItem("isPhonegap") === "true")
      {console.log('cordova ready');
      StatusBar.styleDefault();}
          
          //document.addEventListener("deviceready", this.onDeviceReady, false);
          //StatusBar.overlaysWebView(false);
        });
}

  onDeviceReady() {
    console.log("Cordova");
    
  }

openPage(page, param?) {
  this.menu.close();

        //if null open new tab
        if (!page.component)
        {
          let curr = this.config.getCurrent();
          helpers.fullapplink(AppSite, "", curr.instance, curr.org);
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
      this.openPage({ component: LoginPage });
            //this.getNav().setRoot(TodosPage);
          });
    this.events.subscribe('connection:error', (data) => {
      this.nav.alert(data, true);
    });
    this.events.subscribe('config:get', (data) => {
      this.redirect(data);
    });
  }

  unsubscribeToEvents() {
    this.events.unsubscribe('login:failed', null);
    this.events.unsubscribe('connection:error', null);
    this.events.unsubscribe('config:get', null);
  }

}
