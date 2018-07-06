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
var components_1 = require("../../components/components");
var providers_1 = require("../../providers/providers");
var helpers_1 = require("../../directives/helpers");
var ticket_details_1 = require("../ticket-details/ticket-details");
var LocationsPage = (function () {
    function LocationsPage(nav, config, dataProvider, apiData, ticketProvider) {
        this.nav = nav;
        this.config = config;
        this.dataProvider = dataProvider;
        this.apiData = apiData;
        this.ticketProvider = ticketProvider;
        this.LIMIT = 25;
        this.term = '';
    }
    LocationsPage.prototype.onPageLoaded = function () {
        var _this = this;
        this.is_empty = true;
        this.pager = { page: 0, limit: this.LIMIT };
        var timer = setTimeout(function () {
            _this.busy = true;
        }, 500);
        this.getItems("", null, timer);
    };
    LocationsPage.prototype.searchItems = function (searchbar) {
        var _this = this;
        this.items = this.data;
        var q = searchbar.value.trim();
        if (q.trim() == '' || this.busy) {
            return;
        }
        this.date = Date.now();
        if (q.length < 3) {
            this.items = this.data;
            this.is_empty = !this.data.length;
        }
        else {
            var timer = setTimeout(function () { _this.busy = true; }, 500);
            this.getItems(q, null, timer);
        }
    };
    LocationsPage.prototype.getItems = function (term, infiniteScroll, timer) {
        var _this = this;
        var pager = { page: this.pager.page, limit: this.pager.limit };
        var sterm = term;
        if (term.length > 2) {
            pager.page = 0;
        }
        var url = "locations";
        this.apiData.getPaged(helpers_1.addp(url, "search", sterm), pager).subscribe(function (data) {
            var _a;
            if (timer) {
                _this.is_empty = !data.length;
                clearTimeout(timer);
                _this.busy = false;
            }
            _this.count = 25;
            if (!term || term.length < 3) {
                if (timer) {
                    _this.data = data;
                }
                else
                    (_a = _this.data).push.apply(_a, data);
                if (infiniteScroll) {
                    infiniteScroll.enable(data.length == 25);
                }
                _this.count = data.length;
                _this.searchItems({ value: term });
            }
            else if (data.length)
                _this.items = data;
            else
                _this.items = _this.data;
            if (infiniteScroll) {
                infiniteScroll.complete();
            }
        }, function (error) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            console.log(error || 'Server error');
        });
    };
    LocationsPage.prototype.doInfinite = function (infiniteScroll) {
        if (this.date && Date.now() - this.date < 1000) {
            infiniteScroll.complete();
            return;
        }
        if (this.is_empty || this.count < 25) {
            infiniteScroll.complete();
            if ((this.is_empty && !this.term) || this.count < 25)
                infiniteScroll.enable(false);
            return;
        }
        this.pager.page += 1;
        this.term = "";
        this.getItems("", infiniteScroll);
    };
    LocationsPage.prototype.clearSearch = function (searchbar) {
        this.items = this.data;
        this.busy = false;
        if (searchbar)
            searchbar.value = "";
    };
    LocationsPage.prototype.gotoTicket = function (data) {
        var _this = this;
        this.test = false;
        this.clearSearch();
        if (data) {
            this.ticketProvider.getTicketsList("", "", "", { "limit": 25 });
            setTimeout(function () {
                _this.nav.push(ticket_details_1.TicketDetailsPage, data);
            }, 500);
        }
    };
    LocationsPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/locations/locations.html',
            directives: [components_1.LocationsListComponent, components_1.ActionButtonComponent],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.Config, data_provider_1.DataProvider, providers_1.ApiData, providers_1.TicketProvider])
    ], LocationsPage);
    return LocationsPage;
}());
exports.LocationsPage = LocationsPage;
