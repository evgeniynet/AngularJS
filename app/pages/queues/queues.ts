import {Page, Config, Nav} from 'ionic-angular';
import {TicketsPage} from '../tickets/tickets';
import {DataProvider} from '../../providers/data-provider';
import {AjaxSearchPage} from '../ajax-search/ajax-search';
import {QueuesListComponent, ActionButtonComponent} from '../../components/components';

@Page({
  templateUrl: 'build/pages/queues/queues.html',
    directives: [QueuesListComponent, ActionButtonComponent]
})
export class QueuesPage {

    test: boolean;
    term: string = '';
    search_results: any;
    queues: any;
    items: any = [];
    
    constructor(private nav: Nav, private config: Config, private dataProvider: DataProvider) {
  }
    
    onPageLoaded()
    {
        this.dataProvider.getQueueList().subscribe(
            data => {
                this.queues = data;
                this.searchItems({value : this.term});
                    }, 
            error => { 
                console.log(error || 'Server error');}
        ); 
        
    }
    searchItems(searchbar) {
        // Reset items back to all of the items
        this.items = this.queues;
        // set q to the value of the searchbar
        let q = searchbar.value.toLowerCase();

        // if the value is an empty string don't filter the search_results
        if (q.trim() == '') {
            return;
        }

        if (this.queues && q.length > 1)
        {
            this.items = this.queues.filter((queues) => queues.fullname.toLowerCase().indexOf(q) > -1);
        }
    }

    clearSearch(searchbar?)
    {
        this.search_results = [];
        if (searchbar) searchbar.value = "";
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
