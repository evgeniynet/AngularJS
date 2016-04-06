import {App, IonicApp, Config, Platform, NavController, NavParams, Events, MenuController} from 'ionic-angular';
//import {StatusBar} from 'ionic-native';
import {OnInit, OnDestroy} from 'angular2/core';
import {ApiData} from './providers/api-data';
import {DataProvider} from './providers/data-provider';
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
import {TicketCreatePage, CloseTicketModal} from './pages/modals/modals';
import {DashboardPage} from './pages/dashboard/dashboard';
import {OrganizationsPage} from './pages/organizations/organizations';
import {LoginPage} from './pages/login/login';
import {ExpenseCreatePage} from './pages/expense-create/expense-create';
import {ExpensesPage} from './pages/expenses/expenses';

@App({
  templateUrl: 'build/app.html',
    providers: [ApiData, DataProvider, ToastsManager],
    prodMode : false,
    config: {
    tabbarPlacement: 'top'
}
})
class MyApp {
    constructor(private app: IonicApp, private platform: Platform, private config: Config, private toastr: ToastsManager, private events: Events, private menu: MenuController) {

    // set up our app
    this.initializeApp();
        
    config.alert = toastr;
    config.current = {};
        
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
        
        var current = localStorage.current;
        
        //set test config object
        if (current && current != "undefined")
            config.current = JSON.parse(current);
        else if (dontClearCache)
            config.current = MOCKS["config"];
        else
            {
            this.rootPage = LoginPage;
            return;
            }
        
                //accounts, tickets statistics
        config.current.stat = {};
        
        if (!config.current.org || !config.current.instance)
        {
            this.rootPage = OrganizationsPage;
            return;
        }
        
        // set first pages
        //this.rootPage = HelloIonicPage; return;
        this.rootPage = TicketsPage; return;
        //this.rootPage = ExpensesPage; return;
        //this.rootPage = TimelogsPage; return;
        //this.rootPage = TimelogPage; return;
        //this.rootPage = AccountsPage; return;
        //this.rootPage = CloseTicketModal; return;
      
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
