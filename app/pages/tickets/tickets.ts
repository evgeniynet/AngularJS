import {Page, Config, NavController, NavParams} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {TicketsListComponent, ActionButtonComponent} from '../../components/components';

@Page({
    templateUrl: 'build/pages/tickets/tickets.html',
    directives: [TicketsListComponent, ActionButtonComponent],
})
export class TicketsPage {
    constructor(nav: NavController, navParams: NavParams, dataProvider: DataProvider, config: Config) {
        this.nav = nav;
        this.navParams = navParams;
        this.dataProvider = dataProvider;
        this.config = config;
        this.dataProvider = dataProvider;
        
    }
    
    onPageWillEnter()
    {
        let tickets = (this.navParams || {}).data || {};
        tickets.tab = this.config.current.user.is_techoradmin ? 
            (tickets.tab || "tech") : "user";
        this.ticket_tab = tickets.tab;
        this.onSegmentChanged({value: this.ticket_tab, count: tickets.count});
    }

    onSegmentChanged($event) {
        let tab = $event.value;
        if ($event.count !== 0)
            {
                var timer = setTimeout(() => {
            this.busy = true;
        }, 500);
                
        this.dataProvider.getTicketsList(tab).subscribe(
            data => {
                this.tickets = data;
                clearTimeout(timer);
                this.busy = false;
                    }, 
            error => { 
                                  clearTimeout(timer);
                this.busy = false;
                console.log(error || 'Server error');}
        ); 
            }
        else
           this.tickets = null; 
    }
}
