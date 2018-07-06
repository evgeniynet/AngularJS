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
var http_1 = require("@angular/http");
var api_data_1 = require("./api-data");
var helpers_1 = require("../directives/helpers");
require("rxjs");
var DataProvider = (function () {
    function DataProvider(apiData) {
        this.apiData = apiData;
        this.data$ = {};
        this._dataObserver = {};
        this._dataStore = {};
    }
    DataProvider.prototype.checkLogin = function (username, password) {
        if (!username || !password) {
            return this.apiData.handleError("Please enter login and password!");
        }
        var url = "login";
        var headers = new http_1.Headers({
            'Content-Type': 'text/plain;charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*',
            'Authorization': 'Basic ' + btoa(username + ":" + password)
        });
        return this.apiData.request(url, "", "POST", headers);
    };
    DataProvider.prototype.getOrganizations = function (token) {
        if (!token || token.length != 32) {
            return this.apiData.handleError("Invalid token!");
        }
        var url = "organizations";
        var headers = new http_1.Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa("x:" + token)
        });
        return this.apiData.request(url, " ", "", headers);
    };
    DataProvider.prototype.registerOrganization = function (data) {
        var url = "organizations";
        var headers = new http_1.Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        });
        return this.apiData.request(url, data, "POST", headers);
    };
    DataProvider.prototype.deleteFile = function (data) {
        var url = "files/" + data.file_id;
        return this.apiData.get(url, data, "DELETE");
    };
    DataProvider.prototype.getConfig = function () {
        var url = "config";
        return this.apiData.get(url);
    };
    DataProvider.prototype.updateBadge = function () {
        if (window.cordova && ((cordova.plugins || {}).notification || {}).badge) {
            if (localStorage.badge > 0) {
                cordova.plugins.notification.badge.set(localStorage.badge);
            }
            else
                cordova.plugins.notification.badge.clear();
        }
    };
    DataProvider.prototype.getQueueList = function (limit) {
        var _this = this;
        var url = helpers_1.addp("queues", "sort_by", "tickets_count");
        return this.apiData.get(url).map(function (arr) {
            var nt = arr.filter(function (val) { return val.fullname.toLowerCase().indexOf("new ticket") == 0; });
            var badge = 0;
            if (nt && nt.length > 0)
                badge = nt[0].tickets_count;
            localStorage.badge = badge;
            _this.updateBadge();
            if (arr && limit) {
                arr = arr.filter(function (val) { return val.tickets_count > 0; }).slice(0, limit);
            }
            return arr;
        });
    };
    DataProvider.prototype.getInvoices = function (account_id, status, pager) {
        var url = helpers_1.addp("invoices", "account", account_id);
        if (status === false)
            url = helpers_1.addp(url, "status", "unbilled");
        return this.apiData.getPaged(url, pager);
    };
    DataProvider.prototype.getInvoice = function (id, account_id, project_id) {
        var url = "invoices";
        var data = {};
        if (!id) {
            url = helpers_1.addp(url, "status", "unbilled");
            url = helpers_1.addp(url, "account", account_id);
            url = helpers_1.addp(url, "project", project_id);
        }
        else {
            url += "/" + id;
            url = helpers_1.addp(url, "action", "sendEmail");
        }
        return this.apiData.get(url, data);
    };
    DataProvider.prototype.getExpenses = function (account_id, pager) {
        var url = helpers_1.addp("expenses", "account", account_id);
        return this.apiData.getPaged(url, pager);
    };
    DataProvider.prototype.getPriorities = function () {
        return this.apiData.get("priorities");
    };
    DataProvider.prototype.getLocationList = function (pager, is_open) {
        var url = "locations";
        if (is_open)
            url = helpers_1.addp(url, "is_open_tickets", "true");
        return this.apiData.getPaged(url, pager);
    };
    DataProvider.prototype.getAccountList = function (is_dashboard, pager, is_no_stat, is_open) {
        var url = "accounts";
        if (is_no_stat)
            url = helpers_1.addp(url, "is_with_statistics", "false");
        if (is_open)
            url = helpers_1.addp(url, "is_open_tickets", "true");
        return this.apiData.getPaged(url, pager).map(function (arr) {
            if (is_dashboard && arr) {
                arr = arr.filter(function (val) { return val.account_statistics.ticket_counts.open > 0; });
            }
            return arr;
        });
    };
    DataProvider.prototype.getTechniciansList = function (pager, is_stat, is_open) {
        var url = "technicians";
        if (is_stat)
            url = helpers_1.addp(url, "is_with_statistics", "true");
        if (is_open)
            url = helpers_1.addp(url, "is_open_tickets", "true");
        return this.apiData.getPaged(url, pager);
    };
    DataProvider.prototype.getAccountDetails = function (id, is_no_stat) {
        var url = "accounts/" + id;
        if (is_no_stat)
            url = helpers_1.addp(url, "is_with_statistics", "false");
        return this.apiData.get(url);
    };
    DataProvider.prototype.getLocationDetails = function (id, is_no_stat) {
        var url = "locations/" + id;
        if (is_no_stat)
            url = helpers_1.addp(url, "is_with_statistics", "false");
        return this.apiData.get(url);
    };
    DataProvider.prototype.addAccountNote = function (id, note) {
        var url = "accounts/" + id;
        var data = {
            "note": note,
        };
        return this.apiData.get(url, data, "PUT");
    };
    DataProvider.prototype.addUser = function (email, firstname, lastname, role) {
        var url = "users";
        var data = {
            "Lastname": lastname,
            "Firstname": firstname,
            "email": email,
            "role": role
        };
        return this.apiData.get(url, data, "POST");
    };
    DataProvider.prototype.loginSkype = function (data) {
        var url = "skype/login";
        return this.apiData.get(url, data, "POST");
    };
    DataProvider = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [api_data_1.ApiData])
    ], DataProvider);
    return DataProvider;
}());
exports.DataProvider = DataProvider;
