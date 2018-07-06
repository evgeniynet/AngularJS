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
var modals_1 = require("../modals/modals");
var ticket_details_1 = require("../ticket-details/ticket-details");
var ajax_search_1 = require("../ajax-search/ajax-search");
var components_1 = require("../../components/components");
var directives_1 = require("../../directives/directives");
var helpers_1 = require("../../directives/helpers");
var TicketsPage = (function () {
    function TicketsPage(nav, navParams, config, apiData, ticketProvider) {
        this.nav = nav;
        this.navParams = navParams;
        this.config = config;
        this.apiData = apiData;
        this.ticketProvider = ticketProvider;
        this.term = '';
        this.counts = {};
    }
    TicketsPage.prototype.onPageLoaded = function () {
        this.is_tech = this.config.getCurrent("user").is_techoradmin;
        var param = this.navParams.data || {};
        if (param.count)
            this.counts[param.tab] = param.count;
        if (this.is_tech)
            this.ticket_tab = !param.tab ? "tech" : param.tab;
        else
            this.ticket_tab = "user";
        this.nav.tickets_tab = null;
        if (param.key) {
            this.gotoTicket(param);
        }
    };
    TicketsPage.prototype.onPageDidEnter = function () {
        this.term = "";
    };
    TicketsPage.prototype.addTicket = function () {
        var _this = this;
        var myModal = ionic_angular_1.Modal.create(modals_1.TicketCreatePage);
        myModal.onDismiss(function (data1) {
            _this.gotoTicket(data1);
        });
        this.nav.present(myModal);
    };
    TicketsPage.prototype.gotoTicket = function (data) {
        var _this = this;
        this.test = false;
        this.clearSearch();
        if (data) {
            this.ticketProvider.getTicketsList(this.ticket_tab, "", "", { "limit": 25 });
            setTimeout(function () {
                _this.nav.push(ticket_details_1.TicketDetailsPage, data);
            }, 500);
        }
    };
    TicketsPage.prototype.searchItems = function (searchbar) {
        var _this = this;
        this.search_results = [];
        var q = searchbar.value;
        if (q.trim() == '' || this.busy) {
            return;
        }
        if (q.length > 1) {
            var timer = setTimeout(function () { _this.busy = true; }, 500);
            this.getItems(q, timer);
        }
    };
    TicketsPage.prototype.getItems = function (term, timer) {
        var _this = this;
        this.search_results = [];
        var url = "tickets?query=all";
        var pager = { limit: 3 };
        var is_ticket = term[term.length - 1] == " " || term[term.length - 1] == ",";
        if (!is_ticket)
            term += "*";
        else
            url = "tickets/" + term.trim() + ",";
        this.apiData.getPaged(helpers_1.addp(url, "search", term), pager).subscribe(function (data) {
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
    TicketsPage.prototype.clearSearch = function (searchbar) {
        this.search_results = [];
        this.busy = false;
        if (searchbar)
            searchbar.value = "";
    };
    TicketsPage.prototype.getSearch = function (searchbar) {
        this.test = false;
        this.clearSearch();
        var term = searchbar.target.value;
        if (term.length < 4)
            term += "    ";
        var list = { search: term };
        this.test = false;
        this.nav.push(ajax_search_1.AjaxSearchPage, list);
    };
    TicketsPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/tickets/tickets.html',
            directives: [components_1.TicketsListComponent, directives_1.Focuser],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.NavParams, ionic_angular_1.Config, providers_1.ApiData, providers_1.TicketProvider])
    ], TicketsPage);
    return TicketsPage;
}());
exports.TicketsPage = TicketsPage;
