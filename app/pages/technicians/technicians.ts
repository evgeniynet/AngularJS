import {Page, Config, Nav} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {TechniciansListComponent, ActionButtonComponent} from '../../components/components';


@Page({
  templateUrl: 'build/pages/technicians/technicians.html',
    directives: [TechniciansListComponent, ActionButtonComponent],
})
export class TechniciansPage {

    count: number;
    is_empty: boolean;
    busy: boolean;
    params: any;
    pager: any;
    technicians: Array<any>;
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
        this.dataProvider.getTechniciansList( this.pager, true, true).subscribe(
            data => {
                                if (timer) {
                    clearTimeout(timer);
                    this.busy = false;
                    this.technicians = data;
                    //this.config.setStat("technicians", data.length);

                }
                else
                {
                    this.technicians.push(...data);
                    //TODO: how do get technicians stat
                    this.config.current.stat.technicians += data.length;
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
