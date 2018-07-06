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
var time_provider_1 = require("../../providers/time-provider");
var helpers_1 = require("../../directives/helpers");
var timelog_1 = require("../timelog/timelog");
var action_button_1 = require("../../components/action-button/action-button");
var helpers_2 = require("../../directives/helpers");
var pipes_1 = require("../../pipes/pipes");
var TimelogsPage = (function () {
    function TimelogsPage(nav, timeProvider, config, navParams, view) {
        this.nav = nav;
        this.timeProvider = timeProvider;
        this.config = config;
        this.navParams = navParams;
        this.view = view;
        this.LIMIT = 25;
        this.is_empty = false;
        this.initial_load = true;
        this.pager = { page: 0, limit: this.LIMIT };
    }
    TimelogsPage.prototype.onPageLoaded = function () {
        this.params = this.navParams.data || {};
        this.pager = { page: 0 };
        this.params.account = { id: this.params.account_id || "", name: this.params.account_name || "" };
        this.cachename = helpers_1.addp("time", "account", this.params.account.id);
        this.cachelen = (this.timeProvider._dataStore[this.cachename] || {}).length;
        if (this.params.is_empty)
            this.params.count = 0;
        if (this.params.count !== 0) {
            this.getTimeLogs();
        }
        else
            this.is_empty = true;
    };
    TimelogsPage.prototype.getTimeLogs = function () {
        var _this = this;
        this.timeProvider.getTimelogs(this.params.account.id, this.pager);
        this.timelogs = this.timeProvider.times$[this.cachename];
        if (!this.cachelen) {
            var timer = setTimeout(function () {
                _this.busy = true;
            }, 500);
            setTimeout(function () {
                _this.busy = false;
            }, 3000);
            this.timelogs.subscribe(function (data) {
                clearTimeout(timer);
                _this.busy = false;
                _this.is_empty = !data.length;
            });
        }
    };
    TimelogsPage.prototype.onPageWillEnter = function () {
        var _this = this;
        if (this.params.account_name)
            this.view.setBackButtonText('');
        if (!this.initial_load) {
            setTimeout(function () {
                _this.getTimeLogs();
            }, 2000);
        }
        this.initial_load = false;
    };
    TimelogsPage.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        if (this.is_empty || (this.cachelen > 0 && (this.cachelen >= this.params.count || this.cachelen < this.LIMIT)) || (this.params.count > 0 && (this.params.count < this.LIMIT))) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        var cachedlen = (this.timeProvider._dataStore[this.cachename] || {}).length;
        this.timeProvider.getTimelogs(this.params.account.id, this.pager);
        this.timelogs.subscribe(function (data) {
            infiniteScroll.complete();
            var len = data.length;
            infiniteScroll.enable(!(cachedlen == len || len % _this.LIMIT));
            _this.cachelen = len;
        });
    };
    TimelogsPage.prototype.itemTapped = function (time) {
        time = time || {};
        time.account = time.account || this.params.account;
        time.cachename = this.cachename;
        this.nav.push(timelog_1.TimelogPage, time);
    };
    TimelogsPage.prototype.setDate = function (date, showmonth, istime) {
        return date ? helpers_2.getDateTime(date, showmonth, istime) : null;
    };
    TimelogsPage.prototype.getFixed = function (value) {
        return Number(value || "0").toFixed(2).toString();
    };
    TimelogsPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/timelogs/timelogs.html',
            directives: [action_button_1.ActionButtonComponent],
            pipes: [pipes_1.GravatarPipe, pipes_1.MorePipe, pipes_1.LinebreaksPipe],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, time_provider_1.TimeProvider, ionic_angular_1.Config, ionic_angular_1.NavParams, ionic_angular_1.ViewController])
    ], TimelogsPage);
    return TimelogsPage;
}());
exports.TimelogsPage = TimelogsPage;
