import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {TicketProvider, ApiData} from '../../providers/providers';
import {DataProvider} from '../../providers/data-provider';
import {InvoicesPage} from '../invoices/invoices';
import {TimelogsPage} from '../timelogs/timelogs';
import {ContractsPage} from '../contracts/contracts';
import {FileUrlHelper, addp} from '../../directives/helpers';
import {TicketsListComponent} from '../../components/tickets-list/tickets-list';
import {TicketDetailsPage} from '../ticket-details/ticket-details';
import {ActionButtonComponent} from '../../components/action-button/action-button';
import {MorePipe} from '../../pipes/pipes';
import {ExpensesPage} from '../expenses/expenses';
import {AjaxSearchPage} from '../ajax-search/ajax-search';

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
    search_results: any;
    test: boolean;
    term: string = '';
    busy: boolean;

    constructor(private nav: Nav, private navParams: NavParams,private apiData: ApiData, private dataProvider: DataProvider, private ticketProvider: TicketProvider, private config: Config, private view: ViewController) {
        this.details_tab = "Stat";
        this.pages = [ContractsPage, ExpensesPage, TimelogsPage];
  }

      onPageDidEnter() {
        var t = document.getElementsByClassName("searchbar-input");
        t = t[t.length - 1];
        t && t.focus();
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
  this.ticketProvider.getTicketsList("open", this.account.id, "",{ "limit": 25 });
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
    gotoTicket(data)
    {
      this.test = false;
      this.clearSearch();
      if (data)
      {
        setTimeout(() => {
          this.nav.push(TicketDetailsPage, data);
        }, 500);
      }
    }
    searchItems(searchbar) {
      // Reset items back to all of the items
      this.search_results = [];

      // set q to the value of the searchbar
      var q = searchbar.value;

      // if the value is an empty string don't filter the search_results
      if (q.trim() == '' || this.busy) {
        return;
      }

      if (q.length > 1)
      {
        var timer = setTimeout(() => { this.busy = true; }, 500);
        this.searchItemsAPI(q, timer);
      }
    }

    searchItemsAPI(term, timer) {
      this.search_results = [];
      let url = "tickets?query=all&account="+this.account.id; //status=allopen&
      let pager = { limit: 3 };
      this.apiData.getPaged(addp(url, "search", term + "*"), pager).subscribe(
        data => {
          if (timer) {
            clearTimeout(timer);
            this.busy = false;
          }
          this.search_results = data;
        },
        error => {
          if (timer) {
            clearTimeout(timer);
            this.busy = false;
          }
          console.log(error || 'Server error');
        }
        );
    }


    clearSearch(searchbar?)
    {
      this.search_results = [];
      this.busy = false;
      if (searchbar) searchbar.value = "";
    }

    getSearch(searchbar) {
      this.test = false;
      this.clearSearch();
      // Reset items back to all of the items
      // set q to the value of the searchbar
      let term = searchbar.target.value;
      if (term.length < 4)
        term += "    ";
      let list = { search: term, location: this.account };
      this.test = false;
      this.nav.push(AjaxSearchPage, list);
    }

    toggle(){
        this.test = !this.test;
        if (this.test){
            setTimeout(() => {
        var t = document.getElementsByClassName("searchbar-input");
        t = t[t.length - 1];
        t && t.focus();
        }, 500);
        }
    }

  }

