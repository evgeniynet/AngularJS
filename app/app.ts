import {NgZone, ViewChild} from '@angular/core';
import {App, IonicApp, Config, Platform, Nav, NavParams, Events, MenuController, Toast, Alert} from 'ionic-angular';
import {StatusBar, Network, Connection} from 'ionic-native';
import {OnInit, OnDestroy} from '@angular/core';
import {ApiData} from './providers/api-data';
import {DataProvider} from './providers/data-provider';
import {TicketProvider} from './providers/ticket-provider';
import {TimeProvider} from './providers/time-provider';
import {AppSite, MobileSite, dontClearCache, appVersion} from './providers/config';
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
  is_offline: boolean = false;
  offlineTimer: any;
  disconnectSubscription: any;
  connectSubscription: any;
  interval: any;
  img: any = new Image();

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
      tconfig.isPhonegap = tconfig.isPhonegap || localStorage.getItem('isPhonegap') === 'true';
      tconfig.isExtension = tconfig.isExtension || localStorage.getItem('isExtension') === 'true'; 
      tconfig.version = tconfig.version || localStorage.getItem('version'); 
      tconfig.isGoogle = tconfig.isGoogle || localStorage.getItem('isGoogle') === 'true'; 
      tconfig.is_multiple_org = tconfig.is_multiple_org || false; 
      tconfig.username = tconfig.username || localStorage.getItem('username') || ""; 
      if (property)
        return tconfig[property] || "";
      return tconfig; 
    };

    config.setCurrent = function(nconfig) {
      let tconfig = nconfig || {};
      let current = this.current || {};
      tconfig.user = nconfig.user || current.user || {};
      tconfig.is_tech = nconfig.is_tech || nconfig.user.is_techoradmin || false; 
      tconfig.version = nconfig.version || current.version || "0"; 
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
      localStorage.setItem('version', curr.version || "0");
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
          showCloseButton: true,
          closeButtonText: "X"
        });
        //toast.onDismiss(() => {
          //console.log('Dismissed toast');
        //});
        this.present(toast);
      }, 0);

    document.getElementById("pre-bootstrap1").classList.add("loaded");

    setTimeout(
      function () {
        document.getElementsByTagName("ion-loading")[0].outerHTML='';
      },
      800
      );

    config.current = config.getCurrent();
    config.current.isPhonegap = localStorage.getItem("isPhonegap") === "true";
    config.current.isExtension =  window.self !== window.top;
    config.current.version = appVersion;

//"FullSingular"].ToString(), ", ", drvCustomName["FullPlural"].ToString(), ", ", drvCustomName["AbbreviatedSingular"].ToString(), ", ", drvCustomName["AbbreviatedPlural"

var key = helpers.getParameterByName('t');
var email = helpers.getParameterByName('e');
var platform_string = helpers.getParameterByName('ionicPlatform');

if (key) {
  helpers.cleanQuerystring('ionicPlatform', platform_string);
  localStorage.clear();
      //config.clearCurrent();
      config.current.key = key;
      config.current.isGoogle = true;
      config.current.username = email.replace("#", "");
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

        setTimeout(() => this.redirect(true), dontClearCache ? 1000 : 0);
      }

      redirect(isRedirect?) {
        this.dataProvider.getConfig().subscribe(
          data => {
            this.onLine(true);
            clearInterval(this.interval);
            this.interval = setInterval(() => this.redirect(), 5 * 60 * 1000);
            this.redirect_logic(isRedirect, data);
          },
          error => {
            clearInterval(this.interval);
            this.nav.alert(error || 'Server error', true);
            if (this.is_offline && this.config.getCurrent("user").firstname) {
              this.redirect_logic(isRedirect, this.config.getCurrent());
            }
            else
              this.config.current.org = "";
        //localStorage.clear();
        //localStorage.setItem("username", this.config.current.username || "");
        //this.nav.setRoot(LoginPage, null, { animation: "wp-transition" });
      }
      ); 
      }

      redirect_logic(isRedirect?, data?)
      {
    /*
//Debug config values
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
*/
/*
data.names = {
  "ticket": {s: "Ticket1", p: "Tickets1", a:"Tkt1", ap: "Tkts1"},
  "account": {s: "Account1", p: "Accounts1", a:"Acc1", ap: "Accs1"},
  "tech": {s: "Technician1", p: "Technicians1", a:"Tech1", ap: "Techs1"},
  "location": {s: "Location1", p: "Locations1", a:"Loc1", ap: "Locs1"},
  "user": {s: "End User1", p: "End Users1", a:"User1", ap: "Users1"}
};
*/ 
this.config.setCurrent(data);
this.config.saveCurrent();
    // set our app's pages
    if (this.config.current.is_tech)
      this.pages = [
    { title: 'Dashboard', component: DashboardPage, icon: "speedometer", is_active: true },
    { title: data.names.ticket.p, component: TicketsPage, icon: "create", is_active: true },
    { title: 'Timelogs', component: TimelogsPage, icon: "md-time", is_active: this.config.current.is_time_tracking },
    { title: data.names.account.p, component: AccountsPage, icon: "people", is_active: this.config.current.is_account_manager },
    { title: 'Invoices', component: InvoicesPage, icon: "card", is_active: this.config.current.is_time_tracking && this.config.current.is_invoice },
    { title: 'Queues', component: QueuesPage, icon: "list-box", is_active: this.config.current.is_unassigned_queue },
    { title: 'Switch Org', component: OrganizationsPage, icon: "md-swap", is_active: this.config.current.is_multiple_org },
    { title: 'Signout', component: LoginPage, icon: "md-log-in", is_active: true },
    { title: 'Full App', component: null, icon: "md-share-alt", is_active: true },
    ];
    else
      this.pages = [
    { title: data.names.ticket.p, component: TicketsPage, icon: "create", is_active: true },
    { title: 'Switch Org', component: OrganizationsPage, icon: "md-swap", is_active: this.config.current.is_multiple_org },
    { title: 'Signout', component: LoginPage, icon: "md-log-in", is_active: true },
    { title: 'Full App', component: null, icon: "md-share-alt", is_active: true },
    ];

    //if (this.config.current.isPhonegap && this.config.current.key)
    //  initOrgPreferences(this.config.current.org + "-" + this.config.current.instance + ":" + this.config.current.key);
    //getInfo4Extension();
    //var isExtension = localStorage.getItem("isExtension") === "true";
    if (isRedirect && this.config.current.isExtension)
    {
      var loginStr = "login?t=" + this.config.current.key +
      "&o=" + this.config.current.org +
      "&i=" + this.config.current.instance; 
      window.top.postMessage(loginStr,"*");
    }
    if (this.config.current.version !== data.mobile_ver && Number(data.mobile_ver) > Number(this.config.current.version))
      this.presentConfirm(data.mobile_ver, isRedirect);
    else
      this.force_redirect(isRedirect);
  }

  force_redirect(isRedirect)
  {
    if (isRedirect) {
      let page : any = this.config.current.is_tech ? DashboardPage : TicketsPage;
        
        // set first pages
        //page = TicketsPage; 
        //page = ExpensesPage; 
        //page = ExpenseCreatePage; 
        //page = TimelogsPage; 
        //page = TimelogPage; 
        //page = AccountsPage; 
        //page = TicketCreatePage; 
        //page = AddUserModal;
        //page = SignupPage; 

      this.nav.setRoot(page, null, { animation: "wp-transition" });
    }
  }

  presentConfirm(version, isRedirect) {
    this.config.current.version = version;
    let alert = Alert.create({
      title: "Wait. There is update available!",
      subTitle: "Page'll just be reloaded in 2 seconds",
      message: 'Would you like to do it now?',
      cssClass: "hello",
      buttons: [
      {
        text: 'Yes, do',
        role: 'cancel',
        handler: () => {
          location.reload(true);
        }
      },
      {
        text: 'No, later',
        handler: () => {
          alert.dismiss().then(() => {
            this.force_redirect(isRedirect);
          });
          return false;
        }
      }
      ]
    });
    this.nav.present(alert);
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
      if (localStorage.getItem("isPhonegap") === "true") {
        console.log('cordova ready');
        StatusBar.styleDefault();

        this.disconnectSubscription = Network.onDisconnect().subscribe(() => {
          this.onLine(false);
        });

        this.connectSubscription = Network.onConnect().subscribe(() => {
          this.onLine(true);
        });
      }
    });
  }

  checkConnection() {
    if (navigator.onLine) {
      if (localStorage.getItem("isPhonegap") !== "true"){
      //img.style.display = 'none';
      this.img.onload = () => this.onLine(true);
      this.img.onerror = () => this.onLine(false);
      this.img.src = MobileSite + "img/select_arrow.png?rand=" + Math.random();
    }
  }
  else {
    this.onLine(false);
  }
}

onLine(isOnline?){
  if (this.is_offline != !isOnline)
  {
    this.nav.alert(!isOnline ? "Sorry! You are offline now. Please check your internet connection!" : "Hey! You online now!", !isOnline);
    if (localStorage.getItem("isPhonegap") !== "true") {
      if (!isOnline) {
        clearInterval(this.offlineTimer);
        this.offlineTimer = setInterval(() => this.checkConnection(), 10 * 1000);
      }
      else
        clearInterval(this.offlineTimer);
    }
  }
  this.is_offline = !isOnline;
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
    if (this.interval && (page.component == LoginPage || page.component == OrganizationsPage))
      clearInterval(this.interval);

    if (page.index) {
      this.nav.setRoot(page.component || page, {tabIndex: page.index});
    } else {
      this.nav.setRoot(page.component || page);
    }
  }

  ngOnInit() {
    this.subscribeToEvents();
  }

  ngOnDestroy() {
    this.unsubscribeToEvents();
    clearInterval(this.offlineTimer);
    clearInterval(this.interval);

    if (localStorage.getItem("isPhonegap") === "true"){
      this.disconnectSubscription.unsubscribe();
      this.connectSubscription.unsubscribe();
    }
  }

  subscribeToEvents() {
    this.events.subscribe('login:failed', () => {
      this.openPage({ component: LoginPage });
            //this.getNav().setRoot(TodosPage);
          });
    this.events.subscribe('connection:error', (data) => {
      this.checkConnection();
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
