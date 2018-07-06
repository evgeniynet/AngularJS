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
var http_1 = require("@angular/http");
var rxjs_1 = require("rxjs");
var config_1 = require("./config");
var helpers_1 = require("../directives/helpers");
var mocks_1 = require("./mocks");
require("rxjs");
var ApiData = (function () {
    function ApiData(http, config, events) {
        this.http = http;
        this.config = config;
        this.events = events;
    }
    ApiData.prototype.request = function (method, data, type, headers) {
        var _this = this;
        if (config_1.dontClearCache) {
            return this.mock_get(method);
        }
        var req = new http_1.Request({
            method: type || 'GET',
            url: config_1.ApiSite + method,
            headers: headers,
            body: JSON.stringify(data)
        });
        return this.http.request(req)
            .map(function (res) { return res.json(); })
            .catch(function (error) {
            return _this.handleError(error);
        });
    };
    ApiData.prototype.mock_get = function (method) {
        var arr = null;
        var pos = method.indexOf('?');
        if (pos != -1)
            method = method.substring(0, pos);
        arr = mocks_1.MOCKS[method];
        return rxjs_1.Observable.create(function (observer) {
            observer.next(arr);
            observer.complete();
        });
    };
    ApiData.prototype.get = function (method, data, type) {
        var key = this.config.getCurrent("key"), org = this.config.getCurrent("org"), inst = this.config.getCurrent("instance");
        if (!key || !org || !inst || key.length != 32) {
            return this.handleError("403: Invalid organization!");
        }
        var headers = new http_1.Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(org + "-" + inst + ":" + key)
        });
        return this.request(method, data, type, headers);
    };
    ApiData.prototype.processData = function (data) {
        return data;
    };
    ApiData.prototype.getPager = function (url, pager) {
        if (pager) {
            if (pager.limit)
                url = helpers_1.addp(url, "limit", pager.limit);
            if (pager.page)
                url = helpers_1.addp(url, "page", pager.page);
        }
        return url;
    };
    ApiData.prototype.getPaged = function (url, pager) {
        url = this.getPager(url, pager);
        return this.get(url);
    };
    ApiData.prototype.handleError = function (error) {
        var message = "";
        try {
            var e = JSON.parse(error._body);
            if (typeof e === 'string')
                message = e;
            else
                message = ((e || {}).ResponseStatus || {}).Message;
        }
        catch (e) {
            message = error._body;
            if (message == "[object ProgressEvent]")
                message = "Cannot connect to API server";
        }
        message = message || "Error. Please contact Administrator";
        var url = error.url || "";
        var status = (error.status || {}).toString();
        message += " (" + status + ") ";
        if ((status == "403" && !~url.indexOf("organizations")) || ~url.indexOf("config") || ~message.indexOf("User with token")) {
            this.events.publish("login:failed");
        }
        this.events.publish("connection:error", (message || "Error occured") + " Please contact Administator!");
        return rxjs_1.Observable.throw(new Error(message));
    };
    ApiData = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, ionic_angular_1.Config, ionic_angular_1.Events])
    ], ApiData);
    return ApiData;
}());
exports.ApiData = ApiData;
