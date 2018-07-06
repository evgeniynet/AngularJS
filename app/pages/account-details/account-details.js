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
var data_provider_1 = require("../../providers/data-provider");
var invoices_1 = require("../invoices/invoices");
var timelogs_1 = require("../timelogs/timelogs");
var expenses_1 = require("../expenses/expenses");
var helpers_1 = require("../../directives/helpers");
var tickets_list_1 = require("../../components/tickets-list/tickets-list");
var action_button_1 = require("../../components/action-button/action-button");
var pipes_1 = require("../../pipes/pipes");
var AccountDetailsPage = (function () {
    function AccountDetailsPage(nav, navParams, dataProvider, ticketProvider, config, view) {
        this.nav = nav;
        this.navParams = navParams;
        this.dataProvider = dataProvider;
        this.ticketProvider = ticketProvider;
        this.config = config;
        this.view = view;
        this.is_editnote = true;
        this.is_ready = false;
        this.details_tab = "Stat";
        this.pages = [invoices_1.InvoicesPage, expenses_1.ExpensesPage, timelogs_1.TimelogsPage];
    }
    AccountDetailsPage.prototype.onPageLoaded = function () {
        this.account = this.navParams.data || {};
        this.details_tab = "Stat";
        this.tabsTicket = "Open";
    };
    AccountDetailsPage.prototype.onPageWillEnter = function () {
        var _this = this;
        this.ticketProvider.getTicketsList("open", this.account.id, "", { "limit": 25 });
        this.view.setBackButtonText('');
        this.dataProvider.getAccountDetails(this.account.id).subscribe(function (data) {
            _this.account = data;
            _this.is_editnote = !(_this.account.note || "").length;
            _this.is_ready = true;
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    AccountDetailsPage.prototype.saveNote = function (form) {
        var _this = this;
        var note = (form.value || "").trim();
        if (note != (this.account.note || "").trim()) {
            this.dataProvider.addAccountNote(this.account.id, note).subscribe(function (data) { return _this.saveNoteSuccess(note); }, function (error) {
                console.log(error || 'Server error');
            });
        }
        else
            this.saveNoteSuccess(note);
    };
    AccountDetailsPage.prototype.saveNoteSuccess = function (note) {
        this.nav.alert('Note saved :)');
        this.account.note = (note || "").trim();
        this.is_editnote = !this.account.note.length;
    };
    AccountDetailsPage.prototype.onDelete = function (file) {
        var _this = this;
        var data = {
            "file_id": file.id
        };
        this.dataProvider.deleteFile(data).subscribe(function (data) {
            _this.account.files = _this.account.files.filter(function (item) { return item !== file; });
            _this.nav.alert("File " + file.name + " deleted!");
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    AccountDetailsPage.prototype.openPage = function (page, count) {
        var _this = this;
        setTimeout(function () {
            return _this.nav.push(_this.pages[page], { "is_empty": !count, "account_id": _this.account.id || "-1", "account_name": _this.account.name });
        }, this.is_ready ? 0 : 2000);
    };
    AccountDetailsPage.prototype.getFileLink = function (file) {
        return helpers_1.FileUrlHelper.getFileLink(file.url, file.name);
    };
    AccountDetailsPage.prototype.addFilesButton = function () {
        console.log("Function connect");
    };
    AccountDetailsPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/account-details/account-details.html',
            directives: [tickets_list_1.TicketsListComponent, action_button_1.ActionButtonComponent],
            pipes: [pipes_1.MorePipe],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.NavParams, data_provider_1.DataProvider, providers_1.TicketProvider, ionic_angular_1.Config, ionic_angular_1.ViewController])
    ], AccountDetailsPage);
    return AccountDetailsPage;
}());
exports.AccountDetailsPage = AccountDetailsPage;
