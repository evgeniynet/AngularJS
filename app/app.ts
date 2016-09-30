import {NgZone, ViewChild} from '@angular/core';
import {App, IonicApp, Config, Platform, Nav, NavParams, Events, MenuController, Toast, Alert} from 'ionic-angular';
import {StatusBar, Network, Connection} from 'ionic-native';
import {OnInit, OnDestroy} from '@angular/core';
import * as providers from './providers/providers';
import {AppSite, MobileSite, dontClearCache, appVersion} from './providers/config';
import {MOCKS} from './providers/mocks';
import * as helpers from './directives/helpers';
import * as pages from './pages/pages';


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
  providers: [providers.ApiData, providers.DataProvider, providers.TicketProvider, providers.TimeProvider],
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
  is_phonegap: boolean = false;
  offlineTimer: any;
  disconnectSubscription: any;
  connectSubscription: any;
  interval: any;
  img: any = new Image();

  constructor(private app: IonicApp, private platform: Platform, private config: Config, private events: Events, private menu: MenuController, private ticketProvider: providers.TicketProvider, private dataProvider: providers.DataProvider) {

    if (!this.isStorage())
    {
      //todo redirect to Cookies alert
      console.log("Please enable coockies!")
      return;
    }

    this.is_phonegap = localStorage.getItem("isPhonegap") === "true";

    // set up our app
    this.initializeApp();

    this.ExtendConfig();

    setTimeout(() =>
      this.ExtendNavAlert(), 0);

    // disable loading screen
    document.getElementById("pre-bootstrap1").classList.add("loaded");
    setTimeout(function () { document.getElementsByTagName("ion-loading")[0].outerHTML='';},
      800);

var key = helpers.getParameterByName('t');
var email = helpers.getParameterByName('e');
var platform_string = helpers.getParameterByName('ionicPlatform');

if (key) {
  helpers.cleanQuerystring('ionicPlatform', platform_string);
      config.clearCurrent(key);
      localStorage.setItem("isGoogle", "true");
      localStorage.setItem('username', email.replace("#", ""));
      config.saveCurrent();
      this.rootPage = pages.OrganizationsPage;
      return;
    }
    else {
      var error = helpers.getParameterByName('f');
      if (error) {
        helpers.cleanQuerystring('ionicPlatform', platform_string);
        setTimeout(() => this.nav.alert(error, true), 3000);
      }
      localStorage.setItem("isGoogle", "");
    }

        //set test config object
        if (dontClearCache)
          config.current = config.setCurrent(MOCKS["config"]);
        else if (!config.current.is_logged)
        {
          this.rootPage = pages.LoginPage;
          return;
        }

        if (!config.current.is_chosed)
        {
          this.rootPage = pages.OrganizationsPage;
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
              {
                this.config.current.org = "";
              }
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
//Note required on close ticket
data.is_ticket_require_closure_note = false;
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
    if (this.config.current.user.is_techoradmin)
      this.pages = [
    { title: 'Dashboard', component: pages.DashboardPage, icon: "speedometer", is_active: true },
    { title: data.names.ticket.p, component: pages.TicketsPage, icon: "create", is_active: true },
    { title: 'Timelogs', component: pages.TimelogsPage, icon: "md-time", is_active: this.config.current.is_time_tracking },
    { title: data.names.account.p, component: pages.AccountsPage, icon: "people", is_active: this.config.current.is_account_manager },
    { title: 'Invoices', component: pages.InvoicesPage, icon: "card", is_active: this.config.current.is_time_tracking && this.config.current.is_invoice },
    { title: 'Queues', component: pages.QueuesPage, icon: "list-box", is_active: this.config.current.is_unassigned_queue && (!this.config.current.is_limit_assigned_tkts || this.config.current.user.is_admin)},
    { title: 'Switch Org', component: pages.OrganizationsPage, icon: "md-swap", is_active: this.config.current.is_multiple_org },
    { title: 'Signout', component: pages.LoginPage, icon: "md-log-in", is_active: true },
    { title: 'Full App', component: null, icon: "md-share-alt", is_active: true },
    ];
    else
      this.pages = [
    { title: data.names.ticket.p, component: pages.TicketsPage, icon: "create", is_active: true },
    { title: 'Switch Org', component: pages.OrganizationsPage, icon: "md-swap", is_active: this.config.current.is_multiple_org },
    { title: 'Signout', component: pages.LoginPage, icon: "md-log-in", is_active: true },
    { title: 'Full App', component: null, icon: "md-share-alt", is_active: true },
    ];

    //if (localStorage.getItem("isPhonegap") === "true" && this.config.current.key)
    //  initOrgPreferences(this.config.current.org + "-" + this.config.current.instance + ":" + this.config.current.key);
    //getInfo4Extension();
    //var isExtension = localStorage.getItem("isExtension") === "true";
    if (isRedirect && localStorage.getItem("isExtension") === "true")
    {
      var loginStr = "login?t=" + this.config.current.key +
      "&o=" + this.config.current.org +
      "&i=" + this.config.current.instance; 
      window.top.postMessage(loginStr,"*");
    }
    var appVer = localStorage.getItem("version");
    if (appVer !== data.mobile_ver && Number(data.mobile_ver) > Number(appVer))
      this.presentConfirm(data.mobile_ver, isRedirect);
    else
      this.force_redirect(isRedirect);
  }

  force_redirect(isRedirect)
  {
    if (isRedirect) {
      let page : any = this.config.current.user.is_techoradmin ? pages.DashboardPage : pages.TicketsPage;
        
        // set first pages
        //page = pages.TicketsPage; 
        //page = pages.ExpensesPage; 
        //page = pages.ExpenseCreatePage; 
        //page = pages.TimelogsPage; 
        //page = pages.TimelogPage; 
        //page = pages.AccountsPage; 
        //page = pages.TicketCreatePage; 
        //page = pages.AddUserModal;
        //page = pages.SignupPage; 

      this.nav.setRoot(page, null, { animation: "wp-transition" });
    }
  }

  presentConfirm(version, isRedirect) {
    localStorage.setItem("version", version);
    this.config.saveCurrent();
    let alert = Alert.create({
      title: "There is a new update available!",
      message: 'Page will reload in 2 seconds',
      cssClass: "hello",
      buttons: [
      {
        text: "Yes, do it now",
        role: 'cancel',
        handler: () => {
          location.reload(true);
        }
      },
      {
        text: "No, I'll do it later",
        handler: () => {
          alert.dismiss().then(() => {
            this.force_redirect(isRedirect);
          });
          return false;
        }
      }
      ]
    });
    if (localStorage.getItem("isPhonegap") === "true")
      this.nav.alert("There is a new update available! Please kill app and start again to update");
    else  
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
    if (this.interval && (page.component == pages.LoginPage || page.component == pages.OrganizationsPage))
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
      this.config.clearCurrent();
      this.openPage({ component: pages.LoginPage });
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

  ExtendConfig() {

    localStorage.setItem('isExtension', window.self !== window.top ? "true" : "");
    localStorage.setItem("version", appVersion);
    //this.config.current.isPhonegap = localStorage.getItem("isPhonegap") === "true";
    
    this.config.getCurrent = function(property) {
      let tconfig = this.current || JSON.parse(localStorage.getItem("current") || "null") || {};
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

    this.config.current = this.config.getCurrent();
    this.config.current.is_logged = !!this.config.current.key;
    this.config.current.is_chosed = !!this.config.current.instance && !!this.config.current.org && !!this.config.current.key;
    this.config.current.is_online = !this.is_offline;
    var appVer = localStorage.getItem("version");
    this.config.current.is_updated = !(appVer !== this.config.current.mobile_ver && Number(this.config.current.mobile_ver) > Number(appVer));

    this.config.setCurrent = function(nconfig) {
      let tconfig = nconfig || {};
      let current = this.current || {};
      tconfig.user = nconfig.user || current.user || {};
      tconfig.is_multiple_org = nconfig.is_multiple_org || current.is_multiple_org || false; 
      tconfig.stat = nconfig.stat || current.stat || {};
      tconfig.recent = nconfig.recent || current.recent || {};
      tconfig.key = nconfig.key || current.key || "";
      tconfig.org = nconfig.org || current.org || "";
      tconfig.instance = nconfig.instance || current.instance || "";
      this.current = tconfig;
      //this.saveCurrent();
      return tconfig;
    };

    this.config.clearCurrent = function(key) {
      localStorage.removeItem("current");
      this.current = {key: key || "", user: {}, stat: {}, recent: {}};
      //return config;
    };

    this.config.saveCurrent = function(){
      let curr = this.getCurrent();
      localStorage.setItem("current",  JSON.stringify(curr));
      localStorage.setItem("dateformat", curr.user.date_format || 0);
      localStorage.setItem('timeformat', curr.user.time_format || 0);
      localStorage.setItem('currency', curr.currency || "$");
    }

    this.config.getStat = function(property){
      let stat = this.getCurrent("stat")[property];
      if (typeof stat == "undefined")
        return -1;
      return stat || {};
    }

    this.config.setStat = function(property, value){
      this.current.stat[property]  = value;
    }

    this.config.getRecent = function(property){
      let recent = this.getCurrent("recent")[property];
      if (typeof recent == "undefined")
        return -1;
      return recent || {};
    }

    this.config.setRecent = function(property, value){
      this.current.recent[property]  = value;
    }
  }

  ExtendNavAlert () {
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
      };
    }

}
