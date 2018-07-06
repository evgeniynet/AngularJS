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
var todo_provider_1 = require("../../providers/todo-provider");
var todo_create_1 = require("../../pages/todo-create/todo-create");
var helpers_1 = require("../../directives/helpers");
var ticket_details_1 = require("../../pages/ticket-details/ticket-details");
var TodoListComponent = (function () {
    function TodoListComponent(nav, todoProvider, config, navParams) {
        this.nav = nav;
        this.todoProvider = todoProvider;
        this.config = config;
        this.navParams = navParams;
        this.ticket = "";
        this.user = "";
        this.LIMIT = 5000;
        this.is_empty = false;
        this.is_empty_list = true;
        this.undone = 0;
        this.initial_load = true;
        this.is_empty = false;
        this.pager = { page: 0, limit: this.LIMIT };
    }
    TodoListComponent.prototype.ngOnInit = function () {
        if (!this.config.current.user.is_techoradmin)
            return;
        this.hidden = this.simple;
        this.is_empty_list = this.simple;
        this.params = this.navParams.data || {};
        this.params.user = { id: this.params.user_id || this.config.current.user.user_id, name: this.params.user_name || "" };
        if (this.user)
            this.params.user.id = this.user == "all" ? "" : this.user;
        this.cachename = "todos";
        if (this.params.user.id)
            this.cachename = helpers_1.addp(this.cachename, "assigned_id", this.params.user.id);
        if (this.ticket)
            this.cachename = helpers_1.addp(this.cachename, "ticket", this.ticket || "");
        this.cachelen = (this.todoProvider._dataStore[this.cachename] || {}).length;
        if (this.params.is_empty)
            this.params.count = 0;
        this.getTodos();
    };
    TodoListComponent.prototype.getTodos = function () {
        var _this = this;
        this.todoProvider.getTodos(this.params.user.id, this.ticket, this.pager);
        this.todoLists = this.todoProvider.todos$[this.cachename];
        {
            var timer = setTimeout(function () {
                _this.busy = true;
            }, 500);
            setTimeout(function () {
                _this.busy = false;
            }, 3000);
            this.todoLists.subscribe(function (data) {
                clearTimeout(timer);
                var test = [];
                if (data.length && data.filter(function (t) { return t.type == 1; }).length == 0) {
                    test[0] = data[0];
                    test[0].sub = data;
                    data = test;
                }
                _this.busy = false;
                _this.is_empty = !data.length;
                var count = 0, total = 0;
                for (var k in data)
                    for (var l in data[k].sub) {
                        total++;
                        if (!data[k].sub[l].is_completed)
                            count++;
                    }
                ;
                _this.undone = count;
                _this.is_empty_list = _this.simple && !total;
            });
        }
    };
    TodoListComponent.prototype.AddTodo = function (tlist) {
        tlist.hidden = !(tlist.sub || {}).length || !tlist.hidden;
        var myModal = ionic_angular_1.Modal.create(todo_create_1.TodoCreatePage, { "list_id": (tlist || {}).list_id || "" });
        this.nav.present(myModal);
    };
    TodoListComponent.prototype.setDone = function (todo) {
        this.undone = Math.max(todo.is_completed ? --this.undone : ++this.undone, 0);
        var cachename = "todos?assigned_id=" + this.config.current.user.user_id;
        ((this.todoProvider._dataStore[cachename].filter(function (t) { return t.list_id == todo.list_id; }) || [{}])[0].sub.filter(function (d) { return d.id == todo.id; })[0] || {}).is_completed = todo.is_completed;
        this.todoProvider.setCompletedTodo(todo.id, todo.is_completed);
    };
    TodoListComponent.prototype.setDate = function (date, showmonth, istime) {
        return date ? helpers_1.getDateTime(date, showmonth, istime) : null;
    };
    TodoListComponent.prototype.getFixed = function (value) {
        value = (value || "0").toString();
        if (~value.indexOf("."))
            return Number(value).toFixed(2).toString();
        return value;
    };
    TodoListComponent.prototype.itemTapped = function (tlist) {
        tlist.hidden = !(tlist.sub || {}).length || !tlist.hidden;
        var ticket = { "key": tlist.list_ticket_id };
        this.nav.push(ticket_details_1.TicketDetailsPage, ticket);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], TodoListComponent.prototype, "simple", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TodoListComponent.prototype, "ticket", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TodoListComponent.prototype, "user", void 0);
    TodoListComponent = __decorate([
        core_1.Component({
            selector: 'todo-list',
            templateUrl: 'build/components/todo-list/todo-list.html',
            directives: [ionic_angular_1.IONIC_DIRECTIVES],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, todo_provider_1.TodoProvider, ionic_angular_1.Config, ionic_angular_1.NavParams])
    ], TodoListComponent);
    return TodoListComponent;
}());
exports.TodoListComponent = TodoListComponent;
