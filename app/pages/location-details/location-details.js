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
var data_provider_1 = require("../../providers/data-provider");
var modals_1 = require("../modals/modals");
var ticket_details_1 = require("../ticket-details/ticket-details");
var tickets_list_1 = require("../../components/tickets-list/tickets-list");
var providers_1 = require("../../providers/providers");
var helpers_1 = require("../../directives/helpers");
var ajax_search_1 = require("../ajax-search/ajax-search");
var LocationDetailsPage = (function () {
    function LocationDetailsPage(nav, navParams, apiData, dataProvider, ticketProvider, config, view) {
        this.nav = nav;
        this.navParams = navParams;
        this.apiData = apiData;
        this.dataProvider = dataProvider;
        this.ticketProvider = ticketProvider;
        this.config = config;
        this.view = view;
        this.is_ready = false;
        this.term = '';
    }
    LocationDetailsPage.prototype.onPageLoaded = function () {
        this.location = this.navParams.data || {};
        this.tabsTicket = "Open";
    };
    LocationDetailsPage.prototype.onPageWillEnter = function () {
        this.view.setBackButtonText('');
    };
    LocationDetailsPage.prototype.addTicket = function () {
        var _this = this;
        var myModal = ionic_angular_1.Modal.create(modals_1.TicketCreatePage, { "account": { "id": -1 }, "location": this.location });
        myModal.onDismiss(function (data1) {
            _this.ticketProvider.getTicketsList("open", "-1", _this.location.id, { "limit": 25 });
            _this.gotoTicket(data1);
        });
        this.nav.present(myModal);
    };
    LocationDetailsPage.prototype.gotoTicket = function (data) {
        var _this = this;
        this.test = false;
        this.clearSearch();
        if (data) {
            setTimeout(function () {
                _this.nav.push(ticket_details_1.TicketDetailsPage, data);
            }, 500);
        }
    };
    LocationDetailsPage.prototype.searchItems = function (searchbar) {
        var _this = this;
        this.search_results = [];
        var q = searchbar.value;
        if (q.trim() == '' || this.busy) {
            return;
        }
        if (q.length > 1) {
            var timer = setTimeout(function () { _this.busy = true; }, 500);
            this.searchItemsAPI(q, timer);
        }
    };
    LocationDetailsPage.prototype.searchItemsAPI = function (term, timer) {
        var _this = this;
        this.search_results = [];
        var url = "tickets?query=all&location=" + this.location.id;
        var pager = { limit: 3 };
        this.apiData.getPaged(helpers_1.addp(url, "search", term + "*"), pager).subscribe(function (data) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            _this.search_results = data;
        }, function (error) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            console.log(error || 'Server error');
        });
    };
    LocationDetailsPage.prototype.clearSearch = function (searchbar) {
        this.search_results = [];
        this.busy = false;
        if (searchbar)
            searchbar.value = "";
    };
    LocationDetailsPage.prototype.getSearch = function (searchbar) {
        this.test = false;
        this.clearSearch();
        var term = searchbar.target.value;
        if (term.length < 4)
            term += "    ";
        var list = { search: term, location: this.location };
        this.test = false;
        this.nav.push(ajax_search_1.AjaxSearchPage, list);
    };
    LocationDetailsPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/location-details/location-details.html',
            directives: [tickets_list_1.TicketsListComponent],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.NavParams, providers_1.ApiData, data_provider_1.DataProvider, providers_1.TicketProvider, ionic_angular_1.Config, ionic_angular_1.ViewController])
    ], LocationDetailsPage);
    return LocationDetailsPage;
}());
exports.LocationDetailsPage = LocationDetailsPage;
