import {Page, Config, NavController, NavParams} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {getCurrency, FileUrlHelper} from '../../directives/helpers';
import {TicketsListComponent} from '../../components/tickets-list/tickets-list';
import {ActionButtonComponent} from '../../components/action-button/action-button';
import {MorePipe} from '../../pipes/pipes';

@Page({
  templateUrl: 'build/pages/account-details/account-details.html',
    directives: [TicketsListComponent, ActionButtonComponent],
    pipes: [MorePipe],
})
export class AccountDetailsPage {
    constructor(private nav: NavController, private navParams: NavParams, private dataProvider: DataProvider, private config: Config) {
        this.details_tab = "Stat";
  }
    
    onPageWillEnter()
    {
                // If we navigated to this page, we will have an item available as a nav param
        this.account = this.navParams.data || {};
        this.details_tab = "Stat";

        this.dataProvider.getAccountDetails(this.account.id).subscribe(
            data => {
                this.account = data;
            }, 
            error => { 
                console.log(error || 'Server error');}
        ); 
    }
    
    getCurrency(value) {
        return getCurrency(value, this.config.current.currency);
    }
    
    getFileLink(file) {
        return FileUrlHelper.getFileLink(file.url,file.name);
    }
}
