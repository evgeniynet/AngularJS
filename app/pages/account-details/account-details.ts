import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {InvoicesPage} from '../invoices/invoices';
import {TimelogsPage} from '../timelogs/timelogs';
import {ExpensesPage} from '../expenses/expenses';
import {FileUrlHelper} from '../../directives/helpers';
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
    is_editnote: boolean = true;
    is_ready: boolean = false;

    constructor(private nav: Nav, private navParams: NavParams, private dataProvider: DataProvider, private config: Config, private view: ViewController) {
        this.details_tab = "Stat";
        this.pages = [InvoicesPage, ExpensesPage, TimelogsPage];
  }
    
    onPageLoaded()
    {
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
        this.is_editnote = !(this.account.note || "").length;
        this.is_ready = true;
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
        this.account.note = (note || "").trim();
        this.is_editnote = !this.account.note.length;
    }

    onDelete(file){
     let data = {
       "file_id": file.id
     };

     this.dataProvider.deleteFile(data).subscribe(
       data => {
         this.account.files = this.account.files.filter(item => item !== file);
         this.nav.alert(`File ${file.name} deleted!`);
       },
       error => {
         console.log(error || 'Server error');
       }
       );
   }

    openPage(page, count)
    {
        setTimeout(() =>
        this.nav.push(this.pages[page], {"is_empty": !count, "account_id": this.account.id || "-1", "account_name": this.account.name}),
        this.is_ready ? 0 : 2000);
    }
    
    getFileLink(file) {
        return FileUrlHelper.getFileLink(file.url,file.name);
    }

    addFilesButton() {
    console.log("Function connect");
       
    }
}
