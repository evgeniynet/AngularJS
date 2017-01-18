import {Nav, NavParams, Page, Config, ViewController, Modal} from 'ionic-angular';
import {ApiData} from '../../../providers/api-data';
import {getFullName} from '../../../directives/helpers';
import {AddUserModal} from '../modals';

@Page({
    templateUrl: 'build/pages/modals/infinity-select/infinity-select.html',
})

export class InfinitySelectModal {

    items: Array<any>;
    url: string;
    name: string;
    term: string;
    data: any;
    count: number;
    is_empty: boolean;
    busy: boolean;
    pager: any;
    isbutton: boolean;
    isdefault_enabled: boolean = false;
    isnew_enabled: boolean = false;


    constructor(private nav: Nav, private navParams: NavParams, private config: Config, private apiData: ApiData,
        private viewCtrl: ViewController) 
    {
        nav.swipeBackEnabled = false;
    }

    ngOnInit() {
        this.term = '';
        this.name = this.navParams.data.name || "List";
        this.isdefault_enabled = !~["user", "account", "tech", "task type"].indexOf(this.name.toLowerCase());
        this.url = this.navParams.data.url || "";
        this.data = this.navParams.data.items || {};
        this.items = this.data;
        this.count = this.items.length;
        this.isbutton = this.navParams.data.isbutton;
        this.is_empty = false;
        this.pager = { page: 0 };

        if (this.items.length === 0) {
            var timer = setTimeout(() => {
                this.busy = true;
            }, 500);

            this.getItems(null, timer);
        }
        //else {
        //    this.pager.page = 1;
        //    this.is_empty = true;
        //}
    }

    dismiss(item) {
        //let data = { 'foo': 'bar' };
        item = item || {};
        this.viewCtrl.dismiss(item);
    }

    invite()
    {
        let myModal = Modal.create(AddUserModal, {type: this.name.toLowerCase(), name: this.term});
        myModal.onDismiss(data => {
            if (data){
                //console.log(data);
                data.name = getFullName(data.firstname, data.lastname, data.email);
                this.dismiss(data);
            //this.selects[type].selected = data.id;
            //this.selects[type].value = getFullName(data.firstname, data.lastname, data.email);
        }
        });
        this.nav.present(myModal);
        //setTimeout(() => { this.nav.present(myModal); }, 500);
    }
    
    searchItems(searchbar) {
        // Reset items back to all of the items
        this.items = this.data;

        // set q to the value of the searchbar
        var q = searchbar.value;

        // if the value is an empty string don't filter the items
        if (q.trim() == '') {
            return;
        }

        this.items = this.items.filter((v) => v.name.toLowerCase().indexOf(q.toLowerCase()) > -1);
        this.is_empty = !this.items.length;
    }

    getItems(infiniteScroll, timer?) {
    this.apiData.getPaged(this.url, this.pager).subscribe(
            data => {
                if (data.length && !data[0].name) {
                    var results = [];
                    data.forEach(item => {
                        let name;
                        //if users or techs
                        if (item.email)
                            name = getFullName(item.firstname, item.lastname, item.email, this.isbutton ? "" : " ");
                        //if tickets
                        else if (item.number)
                            name = `#${item.number}: ${item.subject}`;
                        results.push({ id: item.id, name: name });
                    });
                    data = results;
                }
                if (timer) {
                    this.is_empty = !data.length;
                    clearTimeout(timer);
                    this.busy = false;
                    this.data = data;
                }
                else
                    this.data.push(...data);
                this.searchItems({ value: this.term });
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
        this.getItems(infiniteScroll);
    }
}