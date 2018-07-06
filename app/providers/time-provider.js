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
var core_1 = require("@angular/core");
var ionic_angular_1 = require("ionic-angular");
var config_1 = require("./config");
var rxjs_1 = require("rxjs");
var api_data_1 = require("./api-data");
var helpers_1 = require("../directives/helpers");
require("rxjs");
var mocks_1 = require("./mocks");
var TimeProvider = (function () {
    function TimeProvider(apiData, config, events) {
        this.apiData = apiData;
        this.config = config;
        this.events = events;
        this.URL = "time";
        this.times$ = {};
        this._timesObserver = {};
        this._dataStore = {};
    }
    TimeProvider.prototype.getTimelogs = function (account_id, pager) {
        var _this = this;
        var url = helpers_1.addp(this.URL, "account", account_id);
        pager.limit = pager.limit || 25;
        pager.page = pager.page || 0;
        this._dataStore[url] = this._dataStore[url] || [];
        if (config_1.dontClearCache) {
            this.times$[url] = new rxjs_1.Observable(function (observer) { return _this._timesObserver[url] = observer; }).share();
            this._dataStore[url] = mocks_1.MOCKS["time"];
        }
        var cachelen = this._dataStore[url].length;
        if (pager.page == 0) {
            pager.limit = cachelen || pager.limit;
            if (cachelen) {
                setTimeout(function () {
                    if (_this._timesObserver[url])
                        _this._timesObserver[url].next(_this._dataStore[url] || []);
                }, 0);
            }
            else {
                this.times$[url] = new rxjs_1.Observable(function (observer) { return _this._timesObserver[url] = observer; }).share();
            }
        }
        this.apiData.getPaged(url, pager).subscribe(function (data) {
            var _a;
            if (pager.page > 0 && cachelen > 0)
                (_a = _this._dataStore[url]).push.apply(_a, data);
            else
                _this._dataStore[url] = data;
            if (_this._timesObserver[url])
                _this._timesObserver[url].next(_this._dataStore[url]);
        }, function (error) { return console.log('Could not load timelogs.'); });
        return cachelen;
    };
    TimeProvider.prototype.addTime = function (id, data, method) {
        var url = this.URL + (!id ? "" : ("/" + id));
        return this.apiData.get(url, data, method);
    };
    TimeProvider = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [api_data_1.ApiData, ionic_angular_1.Config, ionic_angular_1.Events])
    ], TimeProvider);
    return TimeProvider;
}());
exports.TimeProvider = TimeProvider;
