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
var modals_1 = require("../../pages/modals/modals");
var timelog_1 = require("../../pages/timelog/timelog");
var ticket_details_1 = require("../../pages/ticket-details/ticket-details");
var expense_create_1 = require("../../pages/expense-create/expense-create");
var todo_create_1 = require("../../pages/todo-create/todo-create");
var uninvoices_1 = require("../../pages/uninvoices/uninvoices");
var ActionButtonComponent = (function () {
    function ActionButtonComponent(navParams, nav, config) {
        this.navParams = navParams;
        this.nav = nav;
        this.config = config;
        this.data = {};
    }
    ActionButtonComponent.prototype.ngOnInit = function () {
    };
    ActionButtonComponent.prototype.openModal = function (page) {
        var _this = this;
        var myModal = ionic_angular_1.Modal.create(page, this.data);
        myModal.onDismiss(function (data1) {
            if (data1 && !_this.data.tech && !_this.data.account)
                _this.nav.push(ticket_details_1.TicketDetailsPage, data1);
        });
        this.nav.present(myModal);
    };
    ActionButtonComponent.prototype.presentActionSheet = function () {
        var _this = this;
        if (!this.config.current.user.is_techoradmin) {
            this.openModal(modals_1.TicketCreatePage);
            return;
        }
        var but = [
            {
                icon: 'create',
                text: 'Add ' + this.config.current.names.ticket.s,
                role: '',
                handler: function () {
                    _this.actionSheet.dismiss().then(function () { return _this.openModal(modals_1.TicketCreatePage); });
                    return false;
                }
            }
        ];
        if (this.config.current.is_time_tracking) {
            but.push({
                icon: 'md-time',
                text: 'Add Time',
                role: '',
                handler: function () {
                    _this.actionSheet.dismiss().then(function () { return _this.openModal(timelog_1.TimelogPage); });
                    return false;
                }
            });
            if (this.config.current.is_invoice)
                but.push({
                    icon: 'card',
                    text: 'Add Invoice',
                    role: '',
                    handler: function () {
                        _this.actionSheet.dismiss().then(function () { return _this.nav.push(uninvoices_1.UnInvoicesPage); });
                        return false;
                    }
                });
            if (this.config.current.is_todos)
                but.push({
                    icon: 'ios-list-box-outline',
                    text: 'Add ToDo',
                    role: '',
                    handler: function () {
                        _this.actionSheet.dismiss().then(function () { return _this.nav.push(todo_create_1.TodoCreatePage); });
                        return false;
                    }
                });
        }
        if (this.config.current.is_expenses)
            but.push({
                icon: 'md-list-box',
                text: 'Add Expense',
                role: '',
                handler: function () {
                    _this.actionSheet.dismiss().then(function () { return _this.openModal(expense_create_1.ExpenseCreatePage); });
                    return false;
                }
            });
        but.push({
            icon: '',
            text: 'Cancel',
            role: 'cancel',
            handler: function () {
                console.log('Cancel clicked');
                return true;
            }
        });
        this.actionSheet = ionic_angular_1.ActionSheet.create({
            title: '',
            buttons: but
        });
        this.nav.present(this.actionSheet);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ActionButtonComponent.prototype, "data", void 0);
    ActionButtonComponent = __decorate([
        core_1.Component({
            selector: 'action-button',
            templateUrl: 'build/components/action-button/action-button.html',
            directives: [ionic_angular_1.IONIC_DIRECTIVES],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.NavParams, ionic_angular_1.Nav, ionic_angular_1.Config])
    ], ActionButtonComponent);
    return ActionButtonComponent;
}());
exports.ActionButtonComponent = ActionButtonComponent;
