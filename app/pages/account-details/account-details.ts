import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {InvoicesPage} from '../invoices/invoices';
import {TimelogsPage} from '../timelogs/timelogs';
import {ExpensesPage} from '../expenses/expenses';
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

    account: any;
    pages: Array<any>;
    details_tab: string;
    tabsTicket: string; 
    is_editnote: boolean = false;

    constructor(private nav: Nav, private navParams: NavParams, private dataProvider: DataProvider, private config: Config, private view: ViewController) {
        this.details_tab = "Stat";
        this.pages = [InvoicesPage, ExpensesPage, TimelogsPage];
  }
    
    onPageLoaded()
    {
        this.is_editnote = false;
        // If we navigated to this page, we will have an item available as a nav param
        this.account = this.navParams.data || {};
        this.details_tab = "Stat";
        this.tabsTicket = "Open";
    }

    onPageWillEnter()
{
     this.view.setBackButtonText('');
            this.dataProvider.getAccountDetails(this.account.id).subscribe(
    data => {
        this.account = data;
    },
    error => {
        console.log(error || 'Server error');
    }
); 
        }

    saveNote(form) {
        var note = (form.value || "").trim(); 
        if (note != (this.account.note || "").trim()) {
        this.dataProvider.addAccountNote(this.account.id, note).subscribe(
            data => this.saveNoteSuccess(note),
            error => {
                console.log(error || 'Server error');
            }
        );}
        else
        this.saveNoteSuccess(note);
    }

    saveNoteSuccess(note){
        this.nav.alert('Note saved :)');
        this.account.note = note;
        this.is_editnote = false;
    }

    openPage(page, count)
    {
        this.nav.push(this.pages[page], {"is_empty": !count, "account_id": this.account.id || "-1", "account_name": this.account.name});
    }
    
    getCurrency(value) {
        return getCurrency(value);
    }
    
    getFileLink(file) {
        return FileUrlHelper.getFileLink(file.url,file.name);
    }
}
