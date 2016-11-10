import {Page, Config, Nav, NavParams, Modal} from 'ionic-angular';
import {TicketCreatePage} from '../modals/modals'; 
import {TicketDetailsPage} from '../ticket-details/ticket-details';
import {AjaxSearchPage} from '../ajax-search/ajax-search';
import {TicketsListComponent} from '../../components/components';
import {Focuser} from '../../directives/directives';

@Page({
    templateUrl: 'build/pages/tickets/tickets.html',
    directives: [TicketsListComponent, Focuser],
})
export class TicketsPage {

    counts: any;
    is_tech: boolean;
    ticket_tab: string;
    searchQuery: string = '';
    test: boolean;
    
    constructor(private nav: Nav, private navParams: NavParams, private config: Config) {
        this.counts = {};
    }
    
    onPageLoaded()
    {      
        this.is_tech = this.config.getCurrent("user").is_techoradmin;
        let param = this.navParams.data || {};
        if (param.count)
            this.counts[param.tab] = param.count;
        if (this.is_tech)
            this.ticket_tab = this.config.current.is_limit_assigned_tkts || !param.tab ? "tech" : param.tab;
        else
            this.ticket_tab = "user";
        this.nav.tickets_tab = null;

        if (param.key){
            this.gotoTicket(param);
        }
    }

    onPageWillEnter()
    {

    }

    addTicket(){
        let myModal = Modal.create(TicketCreatePage);
            myModal.onDismiss(data1 => this.gotoTicket(data1));
            this.nav.present(myModal);
    }

    gotoTicket(data)
    {
                if (data)
                    setTimeout(() => {
                        this.nav.push(TicketDetailsPage, data);
                    }, 500);
    }

    clearSearch(searchbar) {
        searchbar.value = "";
    }

    getItems(searchbar) {
        // Reset items back to all of the items
        // set q to the value of the searchbar
        let list = { search: searchbar.target.value };
            this.test = false;
            this.nav.push(AjaxSearchPage, list);
    }

}
