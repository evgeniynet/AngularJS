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
var providers_1 = require("../../../providers/providers");
var helpers_1 = require("../../../directives/helpers");
var class_list_1 = require("../../../components/class-list/class-list");
var location_list_1 = require("../../../components/location-list/location-list");
var select_list_1 = require("../../../components/select-list/select-list");
var ticket_details_1 = require("../../../pages/ticket-details/ticket-details");
var TicketCreatePage = (function () {
    function TicketCreatePage(nav, navParams, ticketProvider, config, viewCtrl) {
        this.nav = nav;
        this.navParams = navParams;
        this.ticketProvider = ticketProvider;
        this.config = config;
        this.viewCtrl = viewCtrl;
        this.fileDest = { ticket: "11" };
        this.files = [];
        nav.swipeBackEnabled = false;
    }
    TicketCreatePage.prototype.ngOnInit = function () {
        this.he = this.config.getCurrent("user");
        this.data = this.navParams.data || {};
        var recent = {};
        if (!this.data.account) {
            recent = this.config.current.recent || {};
        }
        var account_id = (this.data.account || {}).id || (recent.account || {}).selected || this.he.account_id || -1;
        var location_id = (this.data.location || {}).id || (recent.location || {}).selected || 0;
        this.selects = {
            "user": {
                name: "User",
                value: helpers_1.getFullName(this.he.firstname, this.he.lastname, this.he.email),
                selected: this.he.user_id,
                url: "users",
                hidden: false
            },
            "location": {
                name: "Location",
                value: (this.data.location || {}).name || (recent.location || {}).value || "Default",
                selected: location_id,
                url: "locations?account=" + account_id + "&limit=500",
                hidden: false
            },
            "project": {
                name: "Project",
                value: (recent.project || {}).value || "Default",
                selected: (recent.project || {}).selected || 0,
                url: "projects?account=" + account_id + "&is_with_statistics=false",
                hidden: false
            },
            "class": {
                name: "Class",
                value: (recent.class || {}).value || "Default",
                selected: (recent.class || {}).selected || 0,
                url: "classes",
                hidden: false
            },
            "priority": {
                name: "Priority",
                value: (recent.priority || {}).value || "Default",
                selected: (recent.priority || {}).selected || 0,
                url: "priorities",
                hidden: false
            },
            "level": {
                name: "Level",
                value: "Default",
                selected: 0,
                url: "levels",
                hidden: !this.config.current.is_tech_choose_levels && !this.config.current.user.is_admin
            }
        };
        this.selects.tech = {
            name: "Tech",
            value: (this.data.tech || {}).name || "Default",
            selected: (this.data.tech || {}).id || 0,
            url: "technicians",
            hidden: false
        };
        this.selects.account = {
            name: "Account",
            value: (this.data.account || {}).name || (recent.account || {}).value || this.he.account_name,
            selected: account_id,
            url: "accounts?is_with_statistics=false",
            hidden: false
        };
        this.ticket =
            {
                "subject": "",
                "initial_post": "",
                "class_id": null,
                "account_id": account_id,
                "location_id": location_id,
                "user_id": this.he.user_id,
                "tech_id": 0,
                "priority_id": 0,
            };
    };
    TicketCreatePage.prototype.dismissPage = function (data) {
        if (data)
            this.nav.alert(this.config.current.names.ticket.s + ' was Succesfully Created :)');
        this.viewCtrl.dismiss(data);
    };
    TicketCreatePage.prototype.saveSelect = function (event) {
        var name = event.type;
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
        switch (name) {
            case "account":
                this.selects.project.url = "projects?account=" + event.id + "&is_with_statistics=false";
                this.selects.project.value = "Default";
                this.selects.project.selected = 0;
                this.selects.location.url = "locations?account=" + event.id + "&limit=500";
                this.selects.location.value = "Default";
                this.selects.location.selected = 0;
                break;
        }
    };
    TicketCreatePage.prototype.uploadedFile = function (event) {
        this.dismissPage(this.ticket);
    };
    TicketCreatePage.prototype.selectedFile = function (event) {
        this.files = event;
        this.ticket.initial_post = this.ticket.initial_post.trim();
        if (event.length && !this.ticket.initial_post) {
            this.ticket.initial_post = "  ";
        }
    };
    TicketCreatePage.prototype.onSubmit = function (form) {
        var _this = this;
        if (form.valid) {
            if (this.ticket.in_progress && Date.now() - this.ticket.in_progress < 1500) {
                return;
            }
            this.ticket.in_progress = Date.now();
            this.ticket.subject = helpers_1.htmlEscape(this.ticket.subject.trim());
            this.ticket.initial_post = helpers_1.htmlEscape(this.ticket.initial_post.trim()).substr(0, 4500);
            if (this.files.length) {
                this.ticket.initial_post += "\n\nFollowing file" + (this.files.length > 1 ? "s were" : " was") + " uploaded: " + this.files.join(", ") + ".";
            }
            this.ticket.class_id = this.selects.class.selected;
            this.ticket.account_id = this.selects.account.selected;
            this.ticket.location_id = this.selects.location.selected;
            this.ticket.user_id = this.he.is_techoradmin ? this.selects.user.selected : this.he.user_id;
            this.ticket.tech_id = this.selects.tech.selected;
            this.ticket.priority_id = this.selects.priority.selected;
            this.ticket.level = this.selects.level.selected;
            this.ticketProvider.addTicket(this.ticket).subscribe(function (data) {
                if (!_this.data.account) {
                    _this.config.setRecent({ "account": _this.selects.account,
                        "location": _this.selects.location,
                        "project": _this.selects.project,
                        "class": _this.selects.class,
                        "priority": _this.selects.priority });
                }
                if (_this.files.length) {
                    _this.ticket = data;
                    _this.fileDest.ticket = data.key;
                    _this.uploadComponent.onUpload();
                }
                else
                    _this.dismissPage(data);
            }, function (error) {
                _this.nav.alert(_this.he.is_techoradmin ? ("Please select " + _this.config.current.names.tech.s) : error, true);
                console.log(error || 'Server error');
            });
        }
    };
    __decorate([
        core_1.ViewChild(ticket_details_1.UploadButtonComponent),
        __metadata("design:type", ticket_details_1.UploadButtonComponent)
    ], TicketCreatePage.prototype, "uploadComponent", void 0);
    TicketCreatePage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/modals/ticket-create/ticket-create.html',
            directives: [core_1.forwardRef(function () { return class_list_1.ClassListComponent; }), core_1.forwardRef(function () { return location_list_1.LocationListComponent; }), core_1.forwardRef(function () { return select_list_1.SelectListComponent; }), ticket_details_1.UploadButtonComponent],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.NavParams, providers_1.TicketProvider, ionic_angular_1.Config,
            ionic_angular_1.ViewController])
    ], TicketCreatePage);
    return TicketCreatePage;
}());
exports.TicketCreatePage = TicketCreatePage;
