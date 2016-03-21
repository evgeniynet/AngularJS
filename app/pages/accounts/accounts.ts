import {Page, Config, NavController} from 'ionic-framework/ionic';
import {DataProvider} from '../../providers/data-provider';
import {AccountsListComponent, ActionButtonComponent} from '../../components/components';


@Page({
  templateUrl: 'build/pages/accounts/accounts.html',
    directives: [AccountsListComponent, ActionButtonComponent],
})
export class AccountsPage {
    constructor(nav: NavController, config: Config, dataProvider: DataProvider) {
    this.nav = nav;
    this.config = config;
        this.dataProvider = dataProvider;
  }
    
    onPageLoaded()
    {
        var pager = {limit:500};

        this.dataProvider.getAccountList(false, pager, true, true).subscribe(
            data => {this.accounts = data;
                     this.config.current.stat.accounts = data.length;
                    }, 
            error => { 
                console.log(error || 'Server error');}
        ); 
    }
}
