"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ionic_angular_1 = require("ionic-angular");
var core_1 = require("@angular/core");
var ticket_provider_1 = require("../../../providers/ticket-provider");
var api_data_1 = require("../../../providers/api-data");
var helpers_1 = require("../../../directives/helpers");
var select_list_1 = require("../../../components/select-list/select-list");
var CloseTicketModal = (function () {
    function CloseTicketModal(nav, navParams, apiData, ticketProvider, config, viewCtrl) {
        this.nav = nav;
        this.navParams = navParams;
        this.apiData = apiData;
        this.ticketProvider = ticketProvider;
        this.config = config;
        this.viewCtrl = viewCtrl;
        nav.swipeBackEnabled = false;
        this.config = config;
    }
    CloseTicketModal.prototype.ngOnInit = function () {
        var _this = this;
        this.isconfirm = true;
        this.ticket = this.navParams.data || 0;
        this.categories = [];
        this.selects = {
            "resolution": {
                name: "Resolution",
                value: "Resolved",
                selected: 1,
                hidden: false,
                items: [
                    { "name": 'Resolved', "id": 1 },
                    { "name": 'UnResolved', "id": 0 },
                ]
            },
            "category": {
                name: "Category",
                value: "Choose",
                selected: 0,
                hidden: false,
                items: []
            }
        };
        if (!this.config.current.is_resolution_tracking)
            return;
        this.apiData.get("resolution_categories").subscribe(function (data) {
            _this.categories = data;
            _this.selects.category.items = data.filter(function (v) { return v.is_resolved; });
            _this.selects.category.hidden = !_this.selects.category.items.length;
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    CloseTicketModal.prototype.dismiss = function (num) {
        this.viewCtrl.dismiss(num || 0);
    };
    CloseTicketModal.prototype.saveSelect = function (event) {
        var name = event.type;
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
        if (name == "resolution") {
            this.selects.category.value = "Choose";
            this.selects.category.selected = 0;
            this.selects.category.items = this.selects.resolution.selected ?
                this.categories.filter(function (v) { return v.is_resolved; }) : this.categories.filter(function (v) { return !v.is_resolved; });
            this.selects.category.hidden = !this.selects.category.items.length;
        }
    };
    CloseTicketModal.prototype.onSubmit = function (form) {
        var _this = this;
        if (form.valid) {
            var post = helpers_1.htmlEscape((this.ticketnote || "").trim()).substr(0, 5000);
            if (this.config.current.is_ticket_require_closure_note && !post.length) {
                this.nav.alert("Note is required!", true);
                return;
            }
            var data = {
                "status": "closed",
                "note_text": post,
                "is_send_notifications": true,
                "resolved": this.selects.resolution.selected == 1,
                "resolution_id": this.selects.category.selected,
                "confirmed": this.isconfirm,
                "confirm_note": ""
            };
            this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(function (data) {
                _this.nav.alert('Ticket has been closed :)');
                _this.dismiss(1);
            }, function (error) {
                console.log(error || 'Server error');
            });
        }
    };
    CloseTicketModal = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/modals/close-ticket/close-ticket.html',
            directives: [core_1.forwardRef(function () { return select_list_1.SelectListComponent; })],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.NavParams, api_data_1.ApiData, ticket_provider_1.TicketProvider, ionic_angular_1.Config,
            ionic_angular_1.ViewController])
    ], CloseTicketModal);
    return CloseTicketModal;
}());
exports.CloseTicketModal = CloseTicketModal;
