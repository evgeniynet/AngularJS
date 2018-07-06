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
var core_1 = require("@angular/core");
var helpers_1 = require("../../directives/helpers");
var api_data_1 = require("../../providers/api-data");
var class_list_1 = require("../../components/class-list/class-list");
var select_list_1 = require("../../components/select-list/select-list");
var ExpenseCreatePage = (function () {
    function ExpenseCreatePage(nav, navParams, apiData, config, view) {
        this.nav = nav;
        this.navParams = navParams;
        this.apiData = apiData;
        this.config = config;
        this.view = view;
    }
    ExpenseCreatePage.prototype.ngOnInit = function () {
        this.expense = this.navParams.data || {};
        var name = (this.expense.user_name + " " + this.expense.user_email).trim().split(' ')[0];
        if (this.expense.expense_id) {
            this.title = "Expense by " + name + " on\u00A0" + this.setDate(this.expense.date, false, true);
            this.expense.note = helpers_1.linebreaks(this.expense.note, true);
            this.expense.note_internal = helpers_1.linebreaks(this.expense.note_internal, true);
        }
        else if (this.expense.number)
            this.title = "Add Expense to\u00A0#" + this.expense.number + " " + this.expense.subject;
        else
            this.title = "Create Expense";
        this.expense.amount = this.getFixed(this.expense.amount);
        this.isbillable = typeof this.expense.billable === 'undefined' ? true : this.expense.billable;
        this.he = this.config.getCurrent("user");
        var recent = {};
        if (!this.expense.number && !this.expense.expense_id && !this.expense.account) {
            recent = this.config.current.recent || {};
        }
        var account_id = (this.expense.account || {}).id || this.expense.account_id || (recent.account || {}).selected || this.he.account_id || -1;
        var project_id = (this.expense.project || {}).id || this.expense.project_id || (recent.project || {}).selected || 0;
        this.selects = {
            "account": {
                name: "Account",
                value: this.expense.account_name || (this.expense.account || {}).name || (recent.account || {}).value || this.he.account_name,
                selected: account_id,
                url: "accounts?is_with_statistics=false",
                hidden: false
            },
            "project": {
                name: "Project",
                value: this.expense.project_name || (recent.project || {}).value || "Default",
                selected: project_id,
                url: "projects?account=" + account_id + "&is_with_statistics=false",
                hidden: false
            },
        };
    };
    ExpenseCreatePage.prototype.saveSelect = function (event) {
        var name = event.type;
        var account_id = this.selects.account.selected;
        switch (name) {
            case "account":
                if (this.selects.account.selected === event.id) {
                    break;
                }
                this.selects.project.url = "projects?account=" + event.id + "&is_with_statistics=false";
                this.selects.project.value = "Default";
                this.selects.project.selected = 0;
                account_id = event.id;
                this.selects.project.hidden = false;
                break;
        }
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
    };
    ExpenseCreatePage.prototype.onSubmit = function (form) {
        var _this = this;
        if (form.valid) {
            if (this.expense.in_progress && Date.now() - this.expense.in_progress < 1500) {
                return;
            }
            this.expense.in_progress = Date.now();
            var amount = isNaN(form.value.amount) ? 0 : Number(form.value.amount);
            if (amount <= 0) {
                this.nav.alert("Not enough amount", true);
                return;
            }
            var note = helpers_1.htmlEscape(this.expense.note.trim()).substr(0, 5000);
            var isEdit = !!this.expense.expense_id;
            var data = {
                "ticket_key": this.expense.ticket_number || null,
                "account_id": this.selects.account.selected,
                "project_id": !this.expense.ticket_number ? this.selects.project.selected : null,
                "tech_id": isEdit ? this.expense.user_id : this.he.user_id,
                "note": this.expense.note,
                "note_internal": this.expense.note_internal,
                "amount": amount,
                "is_billable": this.isbillable,
                "vendor": this.expense.vendor
            };
            this.apiData.get("expenses" + (!isEdit ? "" : ("/" + this.expense.expense_id)), data, isEdit ? "PUT" : "POST").subscribe(function (data) {
                if (!_this.expense.number && !_this.expense.expense_id && !_this.expense.account) {
                    _this.config.setRecent({ "account": _this.selects.account,
                        "project": _this.selects.project });
                }
                _this.nav.alert('Expense was successfully added :)');
                setTimeout(function () { return _this.close(); }, 500);
            }, function (error) {
                console.log(error || 'Server error');
            });
        }
    };
    ExpenseCreatePage.prototype.setDate = function (date, showmonth, istime) {
        return date ? helpers_1.getDateTime(date, showmonth, istime) : null;
    };
    ExpenseCreatePage.prototype.getFixed = function (value) {
        return Number(value || "0").toFixed(2).toString();
    };
    ExpenseCreatePage.prototype.close = function () {
        this.view.dismiss();
    };
    ExpenseCreatePage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/expense-create/expense-create.html',
            directives: [core_1.forwardRef(function () { return class_list_1.ClassListComponent; }), core_1.forwardRef(function () { return select_list_1.SelectListComponent; })],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.NavParams, api_data_1.ApiData, ionic_angular_1.Config, ionic_angular_1.ViewController])
    ], ExpenseCreatePage);
    return ExpenseCreatePage;
}());
exports.ExpenseCreatePage = ExpenseCreatePage;
