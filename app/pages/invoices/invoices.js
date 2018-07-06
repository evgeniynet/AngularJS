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
var pipes_1 = require("../../pipes/pipes");
var invoice_details_1 = require("../invoice-details/invoice-details");
var uninvoices_1 = require("../uninvoices/uninvoices");
var helpers_1 = require("../../directives/helpers");
var InvoicesPage = (function () {
    function InvoicesPage(nav, dataProvider, config, navParams, view) {
        this.nav = nav;
        this.dataProvider = dataProvider;
        this.config = config;
        this.navParams = navParams;
        this.view = view;
        this.LIMIT = 15;
        this.is_empty = false;
        this.invoices = [];
    }
    InvoicesPage.prototype.onPageLoaded = function () {
        var _this = this;
        this.params = this.navParams.data || {};
        this.pager = { page: 0, limit: this.LIMIT };
        this.params.account = { id: this.params.account_id || 0, name: this.params.account_name || this.config.getCurrent("user").account_name };
        if (this.params.is_empty)
            this.params.count = 0;
        if (this.params.count !== 0) {
            var timer = setTimeout(function () {
                _this.busy = true;
            }, 500);
            this.getItems(null, timer);
        }
        else
            this.is_empty = true;
    };
    InvoicesPage.prototype.onPageWillEnter = function () {
        if (this.params.account_name)
            this.view.setBackButtonText('');
    };
    InvoicesPage.prototype.getItems = function (infiniteScroll, timer) {
        var _this = this;
        this.dataProvider.getInvoices(this.params.account.id, true, this.pager).subscribe(function (data) {
            var _a;
            if (timer) {
                _this.is_empty = !data.length;
                clearTimeout(timer);
                _this.busy = false;
                _this.invoices = data;
            }
            else
                (_a = _this.invoices).push.apply(_a, data);
            if (infiniteScroll) {
                infiniteScroll.enable(data.length == _this.LIMIT);
                infiniteScroll.complete();
            }
            _this.count = data.length;
        }, function (error) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            console.log(error || 'Server error');
        });
    };
    InvoicesPage.prototype.doInfinite = function (infiniteScroll) {
        if (this.is_empty || this.count < this.LIMIT) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        this.getItems(infiniteScroll, null);
    };
    InvoicesPage.prototype.itemTapped = function (item) {
        this.nav.push(invoice_details_1.InvoiceDetailsPage, item);
    };
    InvoicesPage.prototype.showUninvoiced = function () {
        this.nav.push(uninvoices_1.UnInvoicesPage, this.params);
    };
    InvoicesPage.prototype.setDate = function (date, showmonth, istime) {
        return helpers_1.getDateTime(date || new Date(), showmonth, istime);
    };
    InvoicesPage.prototype.getCurrency = function (value) {
        return helpers_1.getCurrency(value);
    };
    InvoicesPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/invoices/invoices.html',
            pipes: [pipes_1.MorePipe],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, data_provider_1.DataProvider, ionic_angular_1.Config, ionic_angular_1.NavParams, ionic_angular_1.ViewController])
    ], InvoicesPage);
    return InvoicesPage;
}());
exports.InvoicesPage = InvoicesPage;
