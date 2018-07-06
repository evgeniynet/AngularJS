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
var todo_create_1 = require("../todo-create/todo-create");
var components_1 = require("../../components/components");
var TodosPage = (function () {
    function TodosPage(nav, config, navParams) {
        this.nav = nav;
        this.config = config;
        this.navParams = navParams;
        this.is_empty = false;
    }
    TodosPage.prototype.onPageLoaded = function () {
        this.params = this.navParams.data || {};
        this.params.user = { id: this.params.user_id || this.config.current.user.user_id, name: this.params.user_name || "" };
    };
    TodosPage.prototype.AddTodo = function () {
        var myModal = ionic_angular_1.Modal.create(todo_create_1.TodoCreatePage, { "list_id": "" });
        this.nav.present(myModal);
    };
    TodosPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/todos/todos.html',
            directives: [components_1.TodoListComponent],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.Config, ionic_angular_1.NavParams])
    ], TodosPage);
    return TodosPage;
}());
exports.TodosPage = TodosPage;
