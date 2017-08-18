import {Page, Config, Nav, NavParams, ViewController, Modal} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {TicketProvider} from '../../providers/providers';
import {TicketCreatePage} from '../modals/modals'; 
import {TicketDetailsPage} from '../ticket-details/ticket-details';
import {TicketsListComponent} from '../../components/tickets-list/tickets-list';

@Page({
  templateUrl: 'build/pages/location-details/location-details.html',
  directives: [TicketsListComponent],
})
export class LocationDetailsPage {

  location: any;
  pages: Array<any>;
  tabsTicket: string; 
  is_ready: boolean = false;

  constructor(private nav: Nav, private navParams: NavParams, private dataProvider: DataProvider, private ticketProvider: TicketProvider, private config: Config, private view: ViewController) {
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
    if (data)
    {
      setTimeout(() => {
        this.nav.push(TicketDetailsPage, data);
      }, 500);
    }
  }
}
