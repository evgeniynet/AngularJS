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
var todo_provider_1 = require("../../providers/todo-provider");
var TodoCreatePage = (function () {
    function TodoCreatePage(nav, navParams, todoProvider, config, view) {
        this.nav = nav;
        this.navParams = navParams;
        this.todoProvider = todoProvider;
        this.config = config;
        this.view = view;
        this.UserDateOffset = -5;
        this.he = config.current.user;
    }
    TodoCreatePage.prototype.ngOnInit = function () {
        this.todo = this.navParams.data || {};
        this.UserDateOffset = this.config.getCurrent("timezone_offset");
        this.displayFormat = helpers_1.getPickerDateTimeFormat(false, false);
        this.todo.due_date = this.todo.due_date ? this.AddHours(this.todo.due_date, this.UserDateOffset) : "";
    };
    TodoCreatePage.prototype.AddHours = function (date, hours) {
        if (date) {
            if (date.length == 19)
                date = date.slice(0, -3);
            var temp = new Date(date);
            return new Date(temp.setTime(temp.getTime() + (hours * 60 * 60 * 1000) + -1 * temp.getTimezoneOffset() * 60 * 1000)).toJSON();
        }
        return date;
    };
    TodoCreatePage.prototype.onSubmit = function (form) {
        var _this = this;
        var hours = this.todo.estimated_remain || "";
        if (form.valid) {
            if (hours) {
                if (~hours.indexOf('.')) {
                    var parts = hours.split('.');
                    hours = Number(parts[0]) + Number(parts[1]) / 60;
                }
                else if (~hours.indexOf(':')) {
                    var parts = hours.split(':');
                    hours = Number(parts[0]) + Number(parts[1]) / 60;
                }
                else if (Number(hours)) {
                    hours = Number(hours);
                }
            }
            else
                hours = 0;
            if (this.todo.in_progress && Date.now() - this.todo.in_progress < 2500) {
                return;
            }
            this.todo.in_progress = Date.now();
            var data = {
                task_id: null,
                title: this.todo.title,
                text: this.todo.note,
                assigned_id: this.he.user_id,
                estimated_remain: hours,
                due_date: this.AddHours(this.todo.due_date, -1 * this.UserDateOffset) || "",
                notify: false,
                list_id: this.todo.list_id,
                ticket_key: null,
                project_id: 0
            };
            this.todoProvider.addTodo(data).subscribe(function (data) {
                _this.nav.alert('Todo was successfully added :)');
                _this.todoProvider.getTodos(_this.he.user_id, "", { page: 0, limit: 5000 });
                setTimeout(function () { return _this.close(); }, 500);
            }, function (error) {
                console.log(error || 'Server error');
            });
        }
    };
    TodoCreatePage.prototype.setMinTime = function (date) {
        return (date || this.todo.due_date || this.AddHours(new Date(), this.UserDateOffset)).substring(0, 4);
    };
    TodoCreatePage.prototype.getStartDate = function (time) {
        return (time || this.todo.due_date || this.AddHours(new Date(), this.UserDateOffset)).substring(0, 19);
    };
    TodoCreatePage.prototype.setStartDate = function (time) {
        if (time) {
            this.todo.due_date = time.substring(0, 19);
        }
    };
    TodoCreatePage.prototype.close = function () {
        this.view.dismiss();
    };
    TodoCreatePage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/todo-create/todo-create.html',
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.NavParams, todo_provider_1.TodoProvider, ionic_angular_1.Config, ionic_angular_1.ViewController])
    ], TodoCreatePage);
    return TodoCreatePage;
}());
exports.TodoCreatePage = TodoCreatePage;
