import {Page, Config, NavController, NavParams} from 'ionic-angular';
import {TicketsListComponent, ActionButtonComponent} from '../../components/components';

@Page({
    templateUrl: 'build/pages/tickets/tickets.html',
    directives: [TicketsListComponent, ActionButtonComponent],
})
export class TicketsPage {
    constructor(private nav: NavController, private navParams: NavParams, private config: Config) {
           this.counts = {};
    }
    
    onPageLoaded()
    {
        let param = (this.navParams || {}).data || {};
        if (param.count)
            this.counts[param.tab] = param.count;
        this.ticket_tab = this.config.getCurrent("is_tech") ? 
            (param.tab || this.nav.tickets_tab || "tech") : "user";
        this.nav.tickets_tab = null;
    }
}
