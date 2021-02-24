import {Page, Config, Nav, NavParams, ViewController, Modal} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {TicketCreatePage} from '../modals/modals'; 
import {TicketDetailsPage} from '../ticket-details/ticket-details';
import {TicketsListComponent} from '../../components/tickets-list/tickets-list';
import {ApiData, TicketProvider} from '../../providers/providers';
import {addp} from '../../directives/helpers';
import {AjaxSearchPage} from '../ajax-search/ajax-search';


@Page({
  templateUrl: 'build/pages/location-details/location-details.html',
  directives: [TicketsListComponent],
})
export class LocationDetailsPage {

  location: any;
  pages: Array<any>;
  tabsTicket: string; 
  is_ready: boolean = false;
  search_results: any;
  test: boolean;
  term: string = '';
  busy: boolean;

  constructor(private nav: Nav, private navParams: NavParams, private apiData: ApiData, private dataProvider: DataProvider, private ticketProvider: TicketProvider, private config: Config, private view: ViewController) {
  }

  onPageLoaded()
  {
    // If we navigated to this page, we will have an item available as a nav param
    this.location = this.navParams.data || {};
    this.tabsTicket = "Open";
  }

  onPageWillEnter()
  {
    //console.log(new Date());
    this.view.setBackButtonText('');
    /*this.dataProvider.getLocationDetails(this.location.id).subscribe(
      data => {
        this.location = data;
        this.is_ready = true;
      },
      error => {
        console.log(error || 'Server error');
      }
      );
      */ 
    }

    addTicket(){
      let myModal = Modal.create(TicketCreatePage, {"account": { "id" : -1}, "location" : this.location});
      myModal.onDismiss(data1 => {
        this.ticketProvider.getTicketsList("open", "-1", this.location.id,{ "limit": 25 }); 
        this.gotoTicket(data1);
      });
      this.nav.present(myModal);
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

    searchItems(searchbar) {}
    /*  // Reset items back to all of the items
      this.search_results = [];

      // set q to the value of the searchbar
      var q = (searchbar.target || {}).value || "";

      // if the value is an empty string don't filter the search_results
      if (q.trim() == '' || this.busy) {
        return;
      }

      if (q.length > 1)
      {
        var timer = setTimeout(() => { this.busy = true; }, 500);
        this.searchItemsAPI(q, timer);
      }
    }*/

    searchItemsAPI(term, timer) {
      this.search_results = [];
      let url = "tickets?query=all&location="+this.location.id; //status=allopen&
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
      let list = { search: term, location: this.location };
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
