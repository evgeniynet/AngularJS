import {Page, ActionSheet, NavController} from 'ionic/ionic';
import {DataProvider} from '../../providers/data-provider';
import {TicketsListComponent} from '../../components/tickets-list';
import {TicketsPage} from '../tickets/tickets';
import {QueuesPage} from '../queues/queues';
import {AccountDetailsPage} from '../account-details/account-details';

/*
  Generated class for the DashboardPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/dashboard/dashboard.html',
    directives: [TicketsListComponent],
})
export class DashboardPage {
    constructor(nav: NavController, dataProvider: DataProvider) {
    this.nav = nav;
    this.queues = null;
        
        dataProvider.getQueueList(3).subscribe(data => {this.queues = data}, error => { console.log(error || 'Server error');}); 
  }
    
    itemTappedTL() {this.nav.push(TicketsPage);}
    
    itemTappedAD() {this.nav.push(AccountDetailsPage);}
    
    presentActionSheet() {
        let actionSheet = ActionSheet.create({
            title: '',
            buttons: [
                {
                    icon: 'create-outline',
                    text: 'Add Ticket',
                    handler: () => {
                        console.log('Destructive clicked');
                    }
                },{
                    icon: 'md-time',
                    text: 'Add Time',
                    handler: () => {
                        console.log('Archive clicked');
                    }
                },{
                    icon: 'card',
                    text: 'Add Invoice',
                    handler: () => {
                        console.log('Archive clicked');
                    }
                },{
                    icon: 'calculator',
                    text: 'Add Expense',
                    handler: () => {
                        console.log('Archive clicked');
                    }
                },{
                    icon: '',
                    text: 'Cancel',
                    style: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        this.nav.present(actionSheet);
    }
    
    onPageWillLeave() {
        actionSheet && actionSheet.dismiss();
    }

}
