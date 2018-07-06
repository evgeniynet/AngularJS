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
var providers_1 = require("../../providers/providers");
var helpers_1 = require("../../directives/helpers");
var ticket_details_1 = require("../ticket-details/ticket-details");
var directives_1 = require("../../directives/directives");
var AjaxSearchPage = (function () {
    function AjaxSearchPage(nav, navParams, config, apiData, ticketProvider) {
        this.nav = nav;
        this.navParams = navParams;
        this.config = config;
        this.apiData = apiData;
        this.ticketProvider = ticketProvider;
        this.location = {};
        this.data = [];
        this.items = [];
        this.is_empty = false;
    }
    AjaxSearchPage.prototype.ngOnInit = function () {
        var _this = this;
        this.term = this.navParams.data.search || "";
        this.location = this.navParams.data.location;
        this.pager = { limit: 20 };
        var q = this.term.toLowerCase();
        if (!this.location) {
            if (this.ticketProvider._dataStore.all.length)
                this.data = this.ticketProvider._dataStore.all;
            else if (this.ticketProvider._dataStore.tech.length)
                this.data = this.ticketProvider._dataStore.tech;
            else if (this.ticketProvider._dataStore.user.length)
                this.data = this.ticketProvider._dataStore.user;
            if (this.data.length && q.length < 4) {
                this.items = this.data.filter(function (v) { return _this.searchCriteria(v, q); });
            }
        }
        this.count = this.items.length;
        if (q.length > 3) {
            var timer = setTimeout(function () {
                _this.is_empty = true;
                _this.busy = true;
            }, 500);
            this.getItems(q, timer);
        }
        else
            this.is_empty = !this.items.length;
    };
    AjaxSearchPage.prototype.dismiss = function (ticket) {
        this.nav.push(ticket_details_1.TicketDetailsPage, ticket);
    };
    AjaxSearchPage.prototype.searchCriteria = function (ticket, term) {
        return ticket.number.toString().indexOf(term) > -1
            || ticket.subject.toLowerCase().indexOf(term) > -1
            || ticket.initial_post.toLowerCase().indexOf(term) > -1
            || ticket.user_firstname.toLowerCase().indexOf(term) > -1
            || ticket.user_lastname.toLowerCase().indexOf(term) > -1
            || ticket.location_name.toLowerCase().indexOf(term) > -1
            || ticket.class_name.toLowerCase().indexOf(term) > -1;
    };
    AjaxSearchPage.prototype.searchItems = function (searchbar) {
        var _this = this;
        this.items = this.data;
        var q = searchbar.value;
        if (q.trim() == '' || this.busy) {
            if (q.trim() == '')
                this.is_empty = !this.items.length;
            return;
        }
        if (q.length < 4) {
            this.items = this.data.filter(function (v) { return _this.searchCriteria(v, q); });
            this.is_empty = !this.items.length;
        }
        else {
            var timer = setTimeout(function () { _this.busy = true; }, 500);
            this.getItems(q, timer);
        }
    };
    AjaxSearchPage.prototype.getItems = function (term, timer) {
        var _this = this;
        this.items = [];
        this.url = "tickets?query=all&location=" + ((this.location || {}).id || "");
        this.apiData.getPaged(helpers_1.addp(this.url, "search", term + "*"), this.pager).subscribe(function (data) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            _this.is_empty = !data.length;
            if (!term) {
                _this.items = _this.data = data;
            }
            else
                _this.items = data;
            _this.count = data.length;
        }, function (error) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            console.log(error || 'Server error');
        });
    };
    AjaxSearchPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/ajax-search/ajax-search.html',
            directives: [directives_1.Focuser],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.NavParams, ionic_angular_1.Config, providers_1.ApiData, providers_1.TicketProvider])
    ], AjaxSearchPage);
    return AjaxSearchPage;
}());
exports.AjaxSearchPage = AjaxSearchPage;
