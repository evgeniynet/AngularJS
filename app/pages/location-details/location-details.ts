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
  templateUrl: 'build/pages/location-details/location-details.html',
    directives: [TicketsListComponent, ActionButtonComponent],
    pipes: [MorePipe],
})
export class LocationDetailsPage {

    location: any;
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
        this.location = this.navParams.data || {};
        this.details_tab = "Stat";
        this.tabsTicket = "Open";
    }

    onPageWillEnter()
{
     this.view.setBackButtonText('');
            this.dataProvider.getLocationDetails(this.location.id).subscribe(
    data => {
        this.location = data;
        this.is_editnote = !(this.location.note || "").length;
        this.is_ready = true;
    },
    error => {
        console.log(error || 'Server error');
    }
); 
        }

    saveNote(form) {
        var note = (form.value || "").trim(); 
        if (note != (this.location.note || "").trim()) {
        this.dataProvider.addAccountNote(this.location.id, note).subscribe(
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
        this.location.note = (note || "").trim();
        this.is_editnote = !this.location.note.length;
    }

    onDelete(file){
     let data = {
       "file_id": file.id
     };

     this.dataProvider.deleteFile(data).subscribe(
       data => {
         this.location.files = this.location.files.filter(item => item !== file);
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
        this.nav.push(this.pages[page], {"is_empty": !count, "account_id": this.location.id || "-1", "account_name": this.location.name}),
        this.is_ready ? 0 : 2000);
    }
    
    getFileLink(file) {
        return FileUrlHelper.getFileLink(file.url,file.name);
    }

    addFilesButton() {
    console.log("Function connect");
       
    }
}
