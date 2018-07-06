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
var ticket_provider_1 = require("../../providers/ticket-provider");
var time_provider_1 = require("../../providers/time-provider");
var config_1 = require("../../providers/config");
var helpers_1 = require("../../directives/helpers");
var login_1 = require("../login/login");
var OrganizationsPage = (function () {
    function OrganizationsPage(nav, dataProvider, config, events, ticketProvider, timeProvider) {
        var _this = this;
        this.nav = nav;
        this.dataProvider = dataProvider;
        this.config = config;
        this.events = events;
        this.ticketProvider = ticketProvider;
        this.timeProvider = timeProvider;
        this.list = [];
        var key = this.config.getCurrent("key");
        events.publish("app:logout", key);
        this.ticketProvider._dataStore = { all: [], alt: [], tech: [], user: [] };
        this.dataProvider._dataStore = this.timeProvider._dataStore = {};
        if (localStorage.getItem("isExtension") === "true")
            window.top.postMessage("logout", "*");
        this.dataProvider.getOrganizations(key).subscribe(function (data) {
            var org = localStorage.getItem('loadOrgKey') || '';
            if (org)
                localStorage.setItem('loadOrgKey', "");
            var org_data = org ? data.filter(function (t) { return t.key == org; }) : null;
            if (org_data)
                data = org_data;
            if (data.length == 1) {
                if (data[0].instances.length == 1) {
                    _this.config.setCurrent({ is_multiple_org: false });
                    _this.onSelectInst({ org: data[0].key, inst: data[0].instances[0].key });
                    return;
                }
                else {
                    _this.list = data;
                    _this.toggle(data[0], 0);
                }
            }
            else
                _this.list = data;
            _this.config.setCurrent({ is_multiple_org: true });
        }, function (error) {
            _this.nav.alert("Cannot get list of Organizations", true);
            _this.config.clearCurrent();
            _this.nav.setRoot(login_1.LoginPage, null, { animation: "wp-transition" });
        });
    }
    OrganizationsPage.prototype.onPageLoaded = function () {
    };
    OrganizationsPage.prototype.toggle = function (org, index) {
        if (org.instances.length == 1) {
            this.onSelectInst({ org: org.key, inst: org.instances[0].key });
            return;
        }
        this.list.forEach(function (o, i) { return o.expanded = false; });
        this.list[index].expanded = this.list[index].expanded ? false : true;
    };
    OrganizationsPage.prototype.support = function () {
        helpers_1.openURLsystem("https://support." + config_1.Site + "portal/");
    };
    OrganizationsPage.prototype.alertOrg = function (name) {
        this.nav.alert(name + " has expired or inactivated. Contact SherpaDesk for assistance. Email: support@sherpadesk.com Phone: +1 (866) 996-1200, then press 2", true);
    };
    OrganizationsPage.prototype.onSelectInst = function (instance) {
        var loading = ionic_angular_1.Loading.create({
            content: "Loading configuration...",
            duration: 3000,
            dismissOnPageChange: true
        });
        this.nav.present(loading);
        this.config.setCurrent({ org: instance.org, instance: instance.inst });
        this.events.publish("config:get", true);
    };
    OrganizationsPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/organizations/organizations.html',
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, data_provider_1.DataProvider, ionic_angular_1.Config, ionic_angular_1.Events, ticket_provider_1.TicketProvider, time_provider_1.TimeProvider])
    ], OrganizationsPage);
    return OrganizationsPage;
}());
exports.OrganizationsPage = OrganizationsPage;
