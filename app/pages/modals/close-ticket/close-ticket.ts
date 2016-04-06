import {NavController, NavParams, Page, ViewController, Config} from 'ionic-angular';
import {forwardRef} from 'angular2/core';
import {DataProvider} from '../../../providers/data-provider';
import {htmlEscape} from '../../../directives/helpers';
import {SelectListComponent} from '../../../components/select-list/select-list';


@Page({
    templateUrl: 'build/pages/modals/close-ticket/close-ticket.html',
    directives: [forwardRef(() => SelectListComponent)],
})
export class CloseTicketModal {

    isconfirm: boolean;
    ticketnote: string;
    key: string;
    selects: Array;

    constructor(private nav: NavController, private navParams: NavParams, private dataProvider: DataProvider, private config: Config,
        private viewCtrl: ViewController) {
    }


    onPageLoaded() {

        this.isconfirm = true;

        this.key = (this.navParams || {}).data || 0;

        let resolution1 = [
        { name: 'Resolved', id: 1 },
        { name: 'UnResolved', id: 0 },
        ];

        this.categories = [
        {
            "name": "Duplicate Issue",
            "id": 4,
            "is_resolved": false,
            "is_active": true
        },
        {
            "name": "No Longer Valid",
            "id": 5,
            "is_resolved": false,
            "is_active": true
        },
        {
            "name": "Test resolution category",
            "id": 6,
            "is_resolved": false,
            "is_active": false
        },
        {
            "name": "On Site",
            "id": 1,
            "is_resolved": true,
            "is_active": true
        },
        {
            "name": "Phone",
            "id": 2,
            "is_resolved": true,
            "is_active": true
        },
        {
            "name": "Remote Support",
            "id": 3,
            "is_resolved": true,
            "is_active": true
        }
        ];

        this.selects = {
            "resolution": {
                name: "Resolution",
                value: "Resolved",
                selected: 1,
                hidden: false,
                items: resolution1
            },
            "category": {
                name: "Category",
                value: "Choose",
                selected: 0,
                hidden: false,
                items: this.categories.filter(v => v.is_resolved)
            }
        };
        this.selects.category.hidden = !this.selects.category.items.length;
    }

    dismiss() {
        //let data = { 'foo': 'bar' };
        //item = item || {};
        this.viewCtrl.dismiss();
    }

    saveSelect(event) {
        let name = event.type;
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
        if (name == "resolution")
        {
            this.selects.category.value = "Choose";
            this.selects.category.selected = 0;
            this.selects.category.items = this.selects.resolution.selected ?
            this.categories.filter(v => v.is_resolved)
            : this.categories.filter(v => !v.is_resolved);
            this.selects.category.hidden = !this.selects.category.items.length;
        }
    }
    
    onSubmit(form) {
        if (form.valid) {
            var post = htmlEscape(this.ticketnote.trim()).substr(0, 5000);

            let data = {
                "status": "closed",
                "note_text": post,
                "is_send_notifications": true,
                "resolved": this.selects.resolution.selected == 1,
                "resolution_id": this.selects.category.selected,
                "confirmed": this.isconfirm,
                "confirm_note": ""

            };

            this.dataProvider.closeOpenTicket(this.key, data).subscribe(
                data => {
                    this.config.alert.success("", 'Ticket has been closed :)');
                    setTimeout(() => { 
                        this.dismiss();
                    }, 1000);
                },
                error => {
                    console.log(error || 'Server error');
                }
                );
        }
    }

}