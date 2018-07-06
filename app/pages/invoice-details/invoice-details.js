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
var helpers_1 = require("../../directives/helpers");
var pipes_1 = require("../../pipes/pipes");
var data_provider_1 = require("../../providers/data-provider");
var api_data_1 = require("../../providers/api-data");
var InvoiceDetailsPage = (function () {
    function InvoiceDetailsPage(nav, navParams, dataProvider, apiData, config, view) {
        this.nav = nav;
        this.navParams = navParams;
        this.dataProvider = dataProvider;
        this.apiData = apiData;
        this.config = config;
        this.view = view;
    }
    InvoiceDetailsPage.prototype.onPageLoaded = function () {
        var _this = this;
        this.invoice = this.navParams.data || {};
        if (this.invoice.id)
            this.title = "Send Invoice #" + this.invoice.id + " to\u00A0" + this.invoice.account_name;
        else
            this.title = "Create Invoice on\u00A0" + this.invoice.account_name;
        this.dataProvider.getInvoice(this.invoice.id, this.invoice.account_id, this.invoice.project_id).subscribe(function (data) {
            if (data.length == 1)
                data = data[0];
            if (data.recipients)
                data.recipients = data.recipients.sort(function (a, b) {
                    return a.is_accounting_contact < b.is_accounting_contact ? 1 : -1;
                });
            _this.invoice = data;
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    InvoiceDetailsPage.prototype.onPageWillEnter = function () {
        this.view.setBackButtonText('');
    };
    InvoiceDetailsPage.prototype.setDate = function (date, showmonth, istime) {
        return helpers_1.getDateTime(date || new Date(), showmonth, istime);
    };
    InvoiceDetailsPage.prototype.getCurrency = function (value) {
        return helpers_1.getCurrency(value);
    };
    InvoiceDetailsPage.prototype.changeContact = function (recipient) {
        recipient.is_accounting_contact = !recipient.is_accounting_contact;
    };
    InvoiceDetailsPage.prototype.send = function () {
        var _this = this;
        if (!this.invoice.recipients.filter(function (v) { return v.is_accounting_contact; }).length) {
            this.nav.alert("No accounting contacts selected", true);
            return;
        }
        if (this.invoice.in_progress && Date.now() - this.invoice.in_progress < 1500) {
            return;
        }
        this.invoice.in_progress = Date.now();
        var emails = "";
        this.invoice.recipients.forEach(function (v) {
            if (v.is_accounting_contact) {
                emails += v.email + ",";
            }
        });
        var data = {};
        if (!this.invoice.id) {
            data.status = "unbilled";
            data.account = this.invoice.account_id;
            data.project = this.invoice.project_id;
            data.start_date = (new Date(this.invoice.start_date || Date.now().toString())).toJSON();
            data.end_date = (new Date(this.invoice.end_date || Date.now().toString())).toJSON();
        }
        else
            data.action = "sendEmail";
        data.recipients = emails;
        this.apiData.get('invoices/' + (this.invoice.id || ""), data, !this.invoice.id ? 'POST' : 'PUT').subscribe(function (data) {
            _this.nav.alert('Hurray! Invoice sent :)');
            if (!_this.invoice.id)
                _this.nav.popTo(_this.nav.getByIndex(_this.nav.length() - 3));
            else
                _this.nav.pop();
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    InvoiceDetailsPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/invoice-details/invoice-details.html',
            pipes: [pipes_1.GravatarPipe],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.NavParams, data_provider_1.DataProvider, api_data_1.ApiData, ionic_angular_1.Config, ionic_angular_1.ViewController])
    ], InvoiceDetailsPage);
    return InvoiceDetailsPage;
}());
exports.InvoiceDetailsPage = InvoiceDetailsPage;
