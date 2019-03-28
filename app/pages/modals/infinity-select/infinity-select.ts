import {Nav, NavParams, Page, Config, ViewController, Modal} from 'ionic-angular';
import {ApiData} from '../../../providers/api-data';
import {isSD} from '../../../providers/config';
import {getFullName, addp} from '../../../directives/helpers';
import {AddUserModal} from '../modals';

@Page({
    templateUrl: 'build/pages/modals/infinity-select/infinity-select.html',
})

export class InfinitySelectModal {

    items: any;
    url: string;
    name: string;
    term: string;
    data: any;
    count: number;
    is_empty: boolean;
    busy: boolean;
    pager: any;
    isbutton: boolean;
    default_text: string = "";
    isdefault_enabled: boolean = false;
    isnew_enabled: boolean = false;
    date: any;
    


    constructor(private nav: Nav, private navParams: NavParams, private config: Config, private apiData: ApiData,
        private viewCtrl: ViewController) 
    {
        nav.swipeBackEnabled = false;
    }

    ngOnInit() {
        this.term = '';
        this.name = this.navParams.data.name || "List";
        if (this.name == "recipient_user")
            this.name = "Recipient"
        this.isdefault_enabled = !~["user", "account", "tech", "task type", "recipient"].indexOf(this.name.toLowerCase()) 
                                ||  !!this.navParams.data.default;
        this.default_text = this.navParams.data.default || "Default";
        this.isnew_enabled = this.config.current.is_add_new_user_link && !!~["user", "tech"].indexOf(this.name.toLowerCase()) 
                             && !this.navParams.data.isnew_disabled;
        this.url = this.navParams.data.url || "";
        this.data = this.navParams.data.items || {};
        this.items = this.data;
        this.count = this.items.length;
        this.isbutton = this.navParams.data.isbutton;
        this.is_empty = false;
        this.pager = { page: ((this.count % 25 == 0) ? Math.max(this.count/25 - 1, 0) : 0), limit: 25 };

        if (this.items.length === 0) {
            var timer = setTimeout(() => {
                this.busy = true;
            }, 500);

            this.getItems("", null, timer);
        }
        //focuser
        //document.getElementsByClassName("searchbar-input")[1].focus();
        //else {
            //    this.pager.page = 1;
            //    this.is_empty = true;
            //}
        }

        onPageDidEnter() {
        var t = document.getElementsByClassName("searchbar-input");
        t = t[t.length - 1];
        t && t.focus();
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
            var q = searchbar.value.trim();

            // if the value is an empty string don't filter the items
            if (q.trim() == '' || this.busy) {
                if (q.trim() == '') 
                    {
                        this.is_empty = !this.items.length;
                        this.count = 25;
                    }
                return;
            }

            this.date = Date.now();

            if (q.length < 3)
            {
                this.items = this.items.filter((v) => v.name.toLowerCase().indexOf(q.toLowerCase()) > -1);
                this.is_empty = !this.items.length;
                this.count = 25;
            }
            else {
                var timer = setTimeout(() => { this.busy = true; }, 500);
                this.getItems(q, null, timer);
            }
        }

        getItems(term, infiniteScroll, timer?) {
            let pager = { page: this.pager.page, limit: this.pager.limit };
            let sterm = term;
            if (!infiniteScroll)
            {
                this.pager.page = 0;
                pager.page = 0;
                this.items = [];
            }
            if (isSD && ~["location", "account"].indexOf(this.name.toLowerCase()))
            {
                sterm = term+"*";
            }

            this.apiData.getPaged(addp(this.url, "search", sterm), pager).subscribe(
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
                            results.push({ id: item.id, name: name, email: item.email });
                        });
                        data = results;
                    }
                    if (timer) {
                        this.is_empty = !data.length;
                        clearTimeout(timer);
                        this.busy = false;
                    }
                    this.count = 25;
                    if (!term || term.length < 3)
                    {
                        if (timer) {
                            this.data = data;
                        }
                        else 
                            this.data.push(...data);
                        //if (infiniteScroll) {
                        //    infiniteScroll.enable(data.length == 25);
                        //}
                        this.count = data.length;
                        this.searchItems({ value: term });
                    }
                    else if (data.length)
                    {
                        this.count = data.length;
                        this.items.push(...data);
                    }
                    else
                        this.items = this.data;
                    if (infiniteScroll) {
                        infiniteScroll.complete();
                    }
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
            if (this.date && Date.now() - this.date < 1000) {infiniteScroll.complete(); return;}
            if (this.is_empty || this.count < 25) {
                infiniteScroll.complete();
                //infiniteScroll.enable(false);
                return;
            }
            this.pager.page += 1;
            //this.term = "";
            this.getItems(this.term, infiniteScroll);
        }
    }