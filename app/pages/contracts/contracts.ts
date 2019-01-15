import {Page, Config, Nav, NavParams, ViewController} from 'ionic-angular';
import {DataProvider} from '../../providers/data-provider';
import {getDateTime, getCurrency} from '../../directives/helpers';
import {GravatarPipe, MorePipe, LinebreaksPipe} from '../../pipes/pipes';

@Page({
    templateUrl: 'build/pages/contracts/contracts.html',
    pipes: [GravatarPipe, MorePipe, LinebreaksPipe],
})
export class ContractsPage {
    LIMIT: number = 15;
    count: number;
    account: Object;
    is_empty_contracts: boolean;
    is_empty_prepaid: boolean;
    busy: boolean;
    params: any;
    pager: any;
    contracts: Array<any>;
    prepaid_packs: Array<any>;



    constructor(private nav: Nav, private dataProvider: DataProvider, private config: Config, private navParams: NavParams, private view: ViewController) {
        this.is_empty_contracts = false;
        this.is_empty_prepaid = false;
    }
    
    onPageLoaded() {
        this.params = this.navParams.data || {};
        this.pager = { page: 0 };
        this.params.account = { id: this.params.account_id || -1, name: this.params.account_name || this.config.getCurrent("user").account_name };
    }

onPageWillEnter()
    {
    if (this.params.account_name)
            this.view.setBackButtonText('');

    if (this.params.is_empty)
        this.params.count = 0;

    if (this.params.count !== 0) {
        var timer = setTimeout(() => {
            this.busy = true;
        }, 500);

        this.getItems(null, timer);
    }
    else
        this.is_empty_prepaid = true;
        this.is_empty_contracts = true;

    }


    getItems(infiniteScroll, timer) {
        this.dataProvider.getContracts(this.pager).subscribe(
            data => {
                if (timer) {
                    this.is_empty_contracts = !data.length;
                    clearTimeout(timer);
                    this.busy = false;
                    this.contracts = data;
                }
                else
                    this.contracts.push(...data);
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

        this.dataProvider.getPrepaid_packs(this.params.account.id, this.pager).subscribe( 
            data => {
                if (timer) {
                    this.is_empty_prepaid = !data.length;
                    clearTimeout(timer);
                    this.busy = false;
                    this.prepaid_packs = data;
                }
                else
                    this.prepaid_packs.push(...data);
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

    setDate(date, showmonth?, istime?) {
        if (date){
        //var time_offset = this.config.getCurrent("timezone_offset");     
        date = new Date(date.substring(0,23)+"Z");
        //date = new Date(date.setTime(date.getTime() + time_offset*60*60*1000)).toJSON();
        return getDateTime(date, showmonth, istime);
    }
     return null;
    }

    doInfinite(infiniteScroll) {
        if (this.is_empty_contracts || this.count < this.LIMIT) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        this.getItems(infiniteScroll, null);
    }

    

    getCurrency(value) {
        return getCurrency(value);
    }
}
