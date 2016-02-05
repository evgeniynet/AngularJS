import {App, IonicApp, Platform} from 'ionic/ionic';

import {HelloIonicPage} from './pages/hello-ionic/hello-ionic';
import {ListPage} from './pages/list/list';
import {QueuesPage} from './pages/queues/queues';
import {InvoicesPage} from './pages/invoices/invoices';
import {AccountsPage} from './pages/accounts/accounts';
import {TimelogsPage} from './pages/timelogs/timelogs';
import {TicketsPage} from './pages/tickets/tickets';
import {DashboardPage} from './pages/dashboard/dashboard';
import {OrganizationsPage} from './pages/organizations/organizations';
import {LoginPage} from './pages/login/login';

@App({
  templateUrl: 'build/app.html'
})
class MyApp {
  constructor(app: IonicApp, platform: Platform) {

    // set up our app
    this.app = app;
    this.platform = platform;
    this.initializeApp();

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
        { title: 'Full App', component: LoginPage, icon: "md-share-alt" },
    ];
      
    // make HelloIonicPage the root (or first) page
    this.rootPage = HelloIonicPage;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('Platform ready');

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
      // good for light backgrounds and dark text;
      if (window.StatusBar) {
        window.StatusBar.styleDefault();
      }
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.app.getComponent('leftMenu').close();
    // navigate to the new page if it is not the current page
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }
}
