import {Page, Config, NavController, NavParams} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {TimelogPage} from '../timelog/timelog';
import {ActionButtonComponent} from '../../components/action-button/action-button';
import {GravatarPipe, MorePipe, LinebreaksPipe} from '../../pipes/pipes';

@Page({
  templateUrl: 'build/pages/timelogs/timelogs.html',
    directives: [ActionButtonComponent],
    pipes: [GravatarPipe, MorePipe, LinebreaksPipe],
})
export class TimelogsPage {

    count: number;
    is_empty: boolean;
    busy: boolean;
    params: Object;
    pager: Object;
    timelogs: Array;


    constructor(private nav: NavController, private dataProvider: DataProvider, private config: Config, private navParams: NavParams) {
        this.is_empty = false;
  }
    
    onPageWillEnter()
    {
        this.params = this.navParams.data || {};
        this.pager = { page: 0 };

        if (this.params.count !== 0) {
            var timer = setTimeout(() => {
                this.busy = true;
            }, 500);

            this.getItems(null, timer);
        }
        else
            this.is_empty = false;
    }


    getItems(infiniteScroll, timer) {
        this.dataProvider.getTimelogs(this.pager).subscribe(
            data => {
                if (timer) {
                    this.is_empty = !data.length;
                    clearTimeout(timer);
                    this.busy = false;
                    this.timelogs = data;
                }
                else
                    this.timelogs.push(...data);
                if (infiniteScroll) {
                    infiniteScroll.enable(data.length == 25);
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
        if (this.is_empty || this.count < 25) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        this.getItems(infiniteScroll, null);
    }
    
    itemTapped(time) {
        this.nav.push(TimelogPage, time);
    }
    
    setDate(date) {
        return date ? new Date(date) : null;
    }
}
