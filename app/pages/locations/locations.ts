import {Page, Config, Nav} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {LocationsListComponent, ActionButtonComponent} from '../../components/components';


@Page({
  templateUrl: 'build/pages/locations/locations.html',
    directives: [LocationsListComponent, ActionButtonComponent],
})
export class LocationsPage {

    count: number;
    is_empty: boolean;
    busy: boolean;
    params: any;
    pager: any;
    locations: Array<any>;
    LIMIT: number = 500;

    constructor(private nav: Nav, private config: Config, private dataProvider: DataProvider) {
  }
    
    onPageLoaded()
    {
        this.pager = { page: 0, limit: this.LIMIT };

        var timer = setTimeout(() => {
            this.busy = true;
        }, 500);

        this.getItems(null, timer);
    }


    getItems(infiniteScroll, timer) {
        this.dataProvider.getLocationList(this.pager, true).subscribe(
            data => {
                //console.log(data);
                if (timer) {
                    clearTimeout(timer);
                    this.busy = false;
                    this.locations = data;
                    //this.config.setStat("accounts", data.length);
                }
                else
                {
                    this.locations.push(...data);
                    //TODO: how do get accounts stat
                    this.config.current.stat.locations += data.length;
                }
                if (infiniteScroll) {
                    infiniteScroll.enable(data.length == this.LIMIT);
                    infiniteScroll.complete();
                }
                this.count = data.length;
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

    doInfinite(infiniteScroll) {
        if (this.count < this.LIMIT) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        this.getItems(infiniteScroll, null);
    }
}
