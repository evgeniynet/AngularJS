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
var helpers_1 = require("../../../directives/helpers");
var select_list_1 = require("../../../components/select-list/select-list");
var ChangeUserModal = (function () {
    function ChangeUserModal(nav, navParams, ticketProvider, config, viewCtrl) {
        this.nav = nav;
        this.navParams = navParams;
        this.ticketProvider = ticketProvider;
        this.config = config;
        this.viewCtrl = viewCtrl;
        nav.swipeBackEnabled = false;
        this.config = config;
    }
    ChangeUserModal.prototype.ngOnInit = function () {
        this.keep_attached = false;
        console.log("name", this.config.current);
        this.ticket = this.navParams.data || 0;
        this.selects = {
            "user": {
                name: "user",
                value: "Choose",
                selected: 0,
                hidden: false,
                url: "users"
            },
        };
    };
    ChangeUserModal.prototype.dismiss = function (data) {
        this.viewCtrl.dismiss(data);
    };
    ChangeUserModal.prototype.saveSelect = function (event) {
        var name = event.type;
        this.selects.selected = event.id;
        this.selects.value = event.name;
    };
    ChangeUserModal.prototype.onSubmit = function (form) {
        var _this = this;
        if (form.valid) {
            var post = helpers_1.htmlEscape((this.ticketnote || "").trim()).substr(0, 5000);
            var newuser_1 = {
                "note_text": post,
                "name": this.selects.value,
                "user_id": this.selects.selected,
                "keep_attached": this.keep_attached
            };
            this.ticketProvider.closeOpenTicket(this.ticket.key, newuser_1).subscribe(function (data) {
                _this.nav.alert(_this.config.current.names.ticket.s + ' has been transferred :)');
                _this.dismiss(newuser_1);
            }, function (error) {
                _this.nav.alert(error, true);
                console.log(error || 'Server error');
            });
        }
    };
    ChangeUserModal = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/modals/change-user/change-user.html',
            directives: [core_1.forwardRef(function () { return select_list_1.SelectListComponent; })],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.NavParams, ticket_provider_1.TicketProvider, ionic_angular_1.Config,
            ionic_angular_1.ViewController])
    ], ChangeUserModal);
    return ChangeUserModal;
}());
exports.ChangeUserModal = ChangeUserModal;
