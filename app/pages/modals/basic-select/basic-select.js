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
var modals_1 = require("../modals");
var helpers_1 = require("../../../directives/helpers");
var BasicSelectModal = (function () {
    function BasicSelectModal(nav, params, viewCtrl) {
        this.nav = nav;
        this.params = params;
        this.viewCtrl = viewCtrl;
        this.searchQuery = '';
        this.is_empty = false;
        this.isdefault_enabled = false;
        this.isnew_enabled = false;
        this.name = this.params.data.name;
        this.isdefault_enabled = !~["user", "account", "tech", "task type"].indexOf(this.name.toLowerCase());
        this.isnew_enabled = !!~["user", "tech"].indexOf(this.name.toLowerCase());
        this.data = this.params.data.items;
        this.items = this.data;
    }
    BasicSelectModal.prototype.dismiss = function (item) {
        item = item || {};
        this.viewCtrl.dismiss(item);
    };
    BasicSelectModal.prototype.invite = function () {
        var _this = this;
        var myModal = ionic_angular_1.Modal.create(modals_1.AddUserModal, { type: this.name.toLowerCase(), name: this.searchQuery });
        myModal.onDismiss(function (data) {
            if (data) {
                data.name = helpers_1.getFullName(data.firstname, data.lastname, data.email);
                _this.dismiss(data);
            }
        });
        this.nav.present(myModal);
    };
    BasicSelectModal.prototype.getItems = function (searchbar) {
        this.items = this.data;
        var q = searchbar.value;
        if (q.trim() == '') {
            return;
        }
        this.items = this.items.filter(function (v) { return v.name.toLowerCase().indexOf(q.toLowerCase()) > -1; });
        this.is_empty = !this.items.length;
    };
    BasicSelectModal = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/modals/basic-select/basic-select.html',
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav,
            ionic_angular_1.NavParams,
            ionic_angular_1.ViewController])
    ], BasicSelectModal);
    return BasicSelectModal;
}());
exports.BasicSelectModal = BasicSelectModal;
