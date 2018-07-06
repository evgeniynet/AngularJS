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
var directives_1 = require("../../directives/directives");
var components_1 = require("../../components/components");
var tickets_1 = require("../tickets/tickets");
var account_details_1 = require("../account-details/account-details");
var ticket_details_1 = require("../ticket-details/ticket-details");
var ajax_search_1 = require("../ajax-search/ajax-search");
var pipes_1 = require("../../pipes/pipes");
var helpers_1 = require("../../directives/helpers");
var DashboardPage = (function () {
    function DashboardPage(nav, config, apiData, dataProvider, ticketProvider, timeProvider) {
        var _this = this;
        this.nav = nav;
        this.config = config;
        this.apiData = apiData;
        this.dataProvider = dataProvider;
        this.ticketProvider = ticketProvider;
        this.timeProvider = timeProvider;
        this.counts = { open_as_tech: 0 };
        this.accounts = [];
        this.queues = [];
        this.term = '';
        this.simple = false;
        var counts = config.getStat("tickets");
        if (counts == -1 && config.current.is_online) {
            this.downloadTimer = setInterval(function () { _this.counts.open_as_tech = ++_this.counts.open_as_tech; }, 800);
        }
        else {
            if (config.current.user.is_limit_assigned_tkts && !config.current.user.is_admin)
                counts.open_all = Math.max(counts.open_as_user, counts.open_as_tech);
            this.counts = this.counts || counts;
        }
    }
    DashboardPage.prototype.onPageLoaded = function () {
        var _this = this;
        this.simple = !this.config.current.is_time_tracking && !this.config.current.is_expenses;
        this.ticketProvider.getTicketsCounts();
        this.ticketProvider.tickets$["tickets/counts"].subscribe(function (data) {
            if (_this.config.current.user.is_limit_assigned_tkts && !_this.config.current.user.is_admin)
                data.open_all = Math.max(data.open_as_user, data.open_as_tech);
            clearInterval(_this.downloadTimer);
            _this.counts = data;
            _this.config.setStat("tickets", {
                "all": data.open_all,
                "tech": data.open_as_tech,
                "alt": data.open_as_alttech,
                "user": data.open_as_user
            });
            setTimeout(function () { _this.saveCache(); }, 1000);
        }, function (error) {
            clearInterval(_this.downloadTimer);
            console.log(error || 'Server error');
        });
        if (this.config.current.is_unassigned_queue) {
            this.queues = this.config.getCache("dashqueues");
            this.dataProvider.getQueueList(3).subscribe(function (data) {
                _this.queues = data;
                _this.config.setCache("dashqueues", data);
            }, function (error) {
                console.log(error || 'Server error');
            });
        }
        if (this.config.current.is_account_manager) {
            this.accounts = this.config.getCache("dashaccounts");
            var accountslen = 500;
            var pager = { limit: ~accountslen ? accountslen : 500 };
            if (!this.accounts || this.accounts.length == 0)
                this.dataProvider.getAccountList(true, pager, true, true).subscribe(function (data) {
                    _this.accounts = data;
                    _this.config.setStat("accounts", data.length);
                    if (_this.simple)
                        _this.config.setCache("dashaccounts", data);
                }, function (error) {
                    console.log(error || 'Server error');
                });
            if (!this.simple)
                this.dataProvider.getAccountList(true, pager).subscribe(function (data) {
                    _this.accounts = data;
                    _this.config.setCache("dashaccounts", data);
                }, function (error) {
                    console.log(error || 'Server error');
                });
        }
        if (!this.ticketProvider._dataStore.tech.length) {
            this.ticketProvider.getTicketsList("tech", "", "", { "limit": 6 });
        }
        this.timer = setTimeout(function () {
            if (!_this.ticketProvider._dataStore.user.length) {
                _this.ticketProvider.getTicketsList("user", "", "", { "limit": 6 });
            }
            if (_this.config.current.is_time_tracking && !(_this.timeProvider._dataStore["time"] || {}).length)
                _this.timeProvider.getTimelogs("", { "limit": 25 });
        }, 2500);
    };
    DashboardPage.prototype.onPageDidEnter = function () {
        this.term = "";
    };
    DashboardPage.prototype.saveCache = function () {
        var el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
        var content = el.closest('ion-nav');
        if (content) {
            window.dash = content.innerHTML.replace(/\s\s+/g, ' ');
        }
    };
    DashboardPage.prototype.ngOnDestroy = function () {
        clearTimeout(this.timer);
    };
    DashboardPage.prototype.searchItems = function (searchbar) {
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
    DashboardPage.prototype.getItems = function (term, timer) {
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
    DashboardPage.prototype.gotoTicket = function (ticket, searchBar) {
        this.test = false;
        this.clearSearch();
        this.nav.push(ticket_details_1.TicketDetailsPage, ticket);
    };
    DashboardPage.prototype.clearSearch = function (searchbar) {
        this.search_results = [];
        this.busy = false;
        if (searchbar)
            searchbar.value = "";
    };
    DashboardPage.prototype.getSearch = function (searchbar) {
        this.test = false;
        this.clearSearch();
        var term = searchbar.target.value;
        if (term.length < 4)
            term += "    ";
        var list = { search: term };
        this.test = false;
        this.nav.push(ajax_search_1.AjaxSearchPage, list);
    };
    DashboardPage.prototype.itemTappedTL = function (tab) {
        this.nav.setRoot(tickets_1.TicketsPage, tab);
    };
    DashboardPage.prototype.itemTappedAD = function () { this.nav.setRoot(account_details_1.AccountDetailsPage); };
    DashboardPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/dashboard/dashboard.html',
            directives: [components_1.QueuesListComponent, components_1.AccountsListComponent, components_1.ActionButtonComponent, components_1.TodoListComponent, directives_1.Focuser],
            pipes: [pipes_1.MorePipe],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.Config, providers_1.ApiData, providers_1.DataProvider, providers_1.TicketProvider, providers_1.TimeProvider])
    ], DashboardPage);
    return DashboardPage;
}());
exports.DashboardPage = DashboardPage;
