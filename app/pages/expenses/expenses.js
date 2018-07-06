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
var helpers_1 = require("../../directives/helpers");
var expense_create_1 = require("../expense-create/expense-create");
var pipes_1 = require("../../pipes/pipes");
var ExpensesPage = (function () {
    function ExpensesPage(nav, dataProvider, config, navParams, view) {
        this.nav = nav;
        this.dataProvider = dataProvider;
        this.config = config;
        this.navParams = navParams;
        this.view = view;
        this.LIMIT = 15;
        this.is_empty = false;
    }
    ExpensesPage.prototype.onPageLoaded = function () {
        this.params = this.navParams.data || {};
        this.pager = { page: 0 };
        this.params.account = { id: this.params.account_id || -1, name: this.params.account_name || this.config.getCurrent("user").account_name };
    };
    ExpensesPage.prototype.onPageWillEnter = function () {
        var _this = this;
        if (this.params.account_name)
            this.view.setBackButtonText('');
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
    ExpensesPage.prototype.getItems = function (infiniteScroll, timer) {
        var _this = this;
        this.dataProvider.getExpenses(this.params.account.id, this.pager).subscribe(function (data) {
            var _a;
            if (timer) {
                _this.is_empty = !data.length;
                clearTimeout(timer);
                _this.busy = false;
                _this.expenses = data;
            }
            else
                (_a = _this.expenses).push.apply(_a, data);
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
    ExpensesPage.prototype.doInfinite = function (infiniteScroll) {
        if (this.is_empty || this.count < this.LIMIT) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        this.getItems(infiniteScroll, null);
    };
    ExpensesPage.prototype.itemTapped = function (expense) {
        expense = expense || {};
        expense.account = expense.account || this.params.account;
        this.nav.push(expense_create_1.ExpenseCreatePage, expense);
    };
    ExpensesPage.prototype.setDate = function (date, showmonth, istime) {
        return date ? helpers_1.getDateTime(date, showmonth, istime) : null;
    };
    ExpensesPage.prototype.getCurrency = function (value) {
        return helpers_1.getCurrency(value);
    };
    ExpensesPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/expenses/expenses.html',
            pipes: [pipes_1.GravatarPipe, pipes_1.MorePipe, pipes_1.LinebreaksPipe],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, data_provider_1.DataProvider, ionic_angular_1.Config, ionic_angular_1.NavParams, ionic_angular_1.ViewController])
    ], ExpensesPage);
    return ExpensesPage;
}());
exports.ExpensesPage = ExpensesPage;
