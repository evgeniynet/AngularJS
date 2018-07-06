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
var mocks_1 = require("./mocks");
require("rxjs");
var TicketProvider = (function () {
    function TicketProvider(apiData, config, events) {
        this.apiData = apiData;
        this.config = config;
        this.events = events;
        this.URL = "tickets";
        this.tickets$ = {};
        this._ticketsObserver = {};
        this._dataStore = {
            all: [],
            alt: [],
            tech: [],
            user: []
        };
    }
    TicketProvider.prototype.getTicketsList = function (tab, id, location, pager) {
        var _this = this;
        id = id || "";
        location = location || "";
        var url = "";
        switch (tab.toString()) {
            case "tech":
                url = this.URL + "?status=open,onhold&role=tech";
                break;
            case "all":
                url = this.URL + "?status=allopen&query=all";
                break;
            case "alt":
                url = this.URL + "?status=open,onhold&role=alt_tech";
                break;
            case "open":
                url = this.URL + "?status=open,onhold&account=" + id + "&location=" + location;
                break;
            case "closed":
                url = this.URL + "?status=closed&account=" + id + "&location=" + location;
                break;
            case 'queue':
                url = "queues/" + id;
                break;
            default:
                url = this.URL + "?status=open,onhold&role=user";
                break;
        }
        pager.limit = pager.limit || 25;
        pager.page = pager.page || 0;
        tab += id || "";
        tab += location || "";
        this._dataStore[tab] = this._dataStore[tab] || [];
        if (config_1.dontClearCache) {
            this.tickets$[tab] = new rxjs_1.Observable(function (observer) { return _this._ticketsObserver[tab] = observer; }).share();
            this._dataStore[tab] = mocks_1.MOCKS["tickets"];
        }
        var cachelen = this._dataStore[tab].length;
        if (pager.page == 0) {
            if (cachelen) {
                setTimeout(function () {
                    if (_this._ticketsObserver[tab])
                        _this._ticketsObserver[tab].next(_this._dataStore[tab] || []);
                }, 0);
            }
            else {
                this.tickets$[tab] = new rxjs_1.Observable(function (observer) { return _this._ticketsObserver[tab] = observer; }).share();
            }
        }
        this.apiData.getPaged(url, pager).subscribe(function (data) {
            var _a;
            if (pager.page > 0 && cachelen > 0)
                (_a = _this._dataStore[tab]).push.apply(_a, data);
            else
                _this._dataStore[tab] = data;
            if (_this._ticketsObserver[tab])
                _this._ticketsObserver[tab].next(_this._dataStore[tab]);
        }, function (error) { return _this.apiData.handleError('Could not load tickets.'); });
        return cachelen;
    };
    TicketProvider.prototype.getTicketDetails = function (key) {
        var url = this.URL + "/" + key;
        return this.apiData.get(url);
    };
    TicketProvider.prototype.getUserProfile = function (user_id) {
        var url = "profile/" + user_id;
        return this.apiData.get(url);
    };
    TicketProvider.prototype.getTicketsCounts = function () {
        var _this = this;
        var url = this.URL + "/counts";
        if (!this._dataStore[url]) {
            this._dataStore[url] = [];
            this.tickets$[url] = new rxjs_1.Observable(function (observer) { _this._ticketsObserver[url] = observer; }).share();
        }
        else {
            if (this._dataStore[url].open_all >= 0) {
                setTimeout(function () {
                    _this._ticketsObserver[url].next(_this._dataStore[url] || []);
                }, 0);
            }
        }
        this.apiData.get(url).subscribe(function (data) {
            _this._dataStore[url] = data;
            _this._ticketsObserver[url].next(_this._dataStore[url]);
        }, function (error) { return console.log('Could not load tickets.'); });
    };
    TicketProvider.prototype.addTicket = function (data) {
        data.status = "open";
        return this.apiData.get(this.URL, data, "POST");
    };
    TicketProvider.prototype.closeOpenTicket = function (id, data) {
        var url = this.URL + "/" + id;
        return this.apiData.get(url, data, "PUT");
    };
    TicketProvider.prototype.escalateTicket = function (id, is_esc) {
        var url = this.URL + "/" + id;
        var data = {
            "action": is_esc ? "escalate" : "deescalate"
        };
        return this.apiData.get(url, data, "PUT");
    };
    TicketProvider.prototype.addTicketPost = function (id, note, files, waiting_response) {
        var url = this.URL + "/" + id;
        var data = {
            "action": "response",
            "note_text": note,
            "files": files || [],
            "is_waiting_on_response": waiting_response
        };
        return this.apiData.get(url, data, "POST");
    };
    TicketProvider.prototype.addTicketWorkpad = function (id, workpad) {
        var url = this.URL + "/" + id;
        var data = {
            "action": "workpad",
            "workpad": workpad,
        };
        return this.apiData.get(url, data, "POST");
    };
    TicketProvider.prototype.addTicketNote = function (id, note) {
        var url = this.URL + "/" + id;
        var data = {
            "action": "note",
            "note": note,
        };
        return this.apiData.get(url, data, "POST");
    };
    TicketProvider = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [api_data_1.ApiData, ionic_angular_1.Config, ionic_angular_1.Events])
    ], TicketProvider);
    return TicketProvider;
}());
exports.TicketProvider = TicketProvider;
