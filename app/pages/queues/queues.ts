import {Page, Nav} from 'ionic-angular';
import {TicketsPage} from '../tickets/tickets';
import {DataProvider} from '../../providers/data-provider';
import {AjaxSearchPage} from '../ajax-search/ajax-search';
import {QueuesListComponent, ActionButtonComponent} from '../../components/components';

@Page({
  templateUrl: 'build/pages/queues/queues.html',
    directives: [QueuesListComponent, ActionButtonComponent]
})
export class QueuesPage {

    queues: any;
    busy: boolean;
    test: boolean;
    search_results: any;
    
    constructor(private nav: Nav, private dataProvider: DataProvider) {
  }
    
    onPageLoaded()
    {
           var timer = setTimeout(() => {
            this.busy = true;
        }, 500);
        this.dataProvider.getQueueList().subscribe(
            data => {
                this.queues = data
                this.busy = false;
                    }, 
            error => { 
                console.log(error || 'Server error');}
        ); 
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
            this.onPageLoaded();
        }
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
        let list = { search: term };
        this.test = false;
        this.nav.push(AjaxSearchPage, list);
    }

}
