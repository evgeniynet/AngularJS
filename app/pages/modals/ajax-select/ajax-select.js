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
var api_data_1 = require("../../../providers/api-data");
var config_1 = require("../../../providers/config");
var modals_1 = require("../modals");
var helpers_1 = require("../../../directives/helpers");
var AjaxSelectModal = (function () {
    function AjaxSelectModal(nav, navParams, config, apiData, viewCtrl) {
        this.nav = nav;
        this.navParams = navParams;
        this.config = config;
        this.apiData = apiData;
        this.viewCtrl = viewCtrl;
        this.isdefault_enabled = false;
        this.isnew_enabled = false;
        nav.swipeBackEnabled = false;
    }
    AjaxSelectModal.prototype.ngOnInit = function () {
        var _this = this;
        this.term = '';
        this.name = this.navParams.data.name || "List";
        this.isdefault_enabled = !~["user", "account", "tech", "task type"].indexOf(this.name.toLowerCase());
        this.isnew_enabled = !!~["user", "tech"].indexOf(this.name.toLowerCase());
        this.url = this.navParams.data.url || "";
        this.data = this.navParams.data.items || {};
        this.pager = { limit: 20 };
        this.items = this.data;
        this.count = this.items.length;
        this.is_empty = false;
        if (this.items.length === 0) {
            var timer = setTimeout(function () {
                _this.busy = true;
            }, 500);
            this.getItems(null, timer);
        }
    };
    AjaxSelectModal.prototype.dismiss = function (item) {
        item = item || {};
        this.viewCtrl.dismiss(item);
    };
    AjaxSelectModal.prototype.invite = function () {
        var _this = this;
        var myModal = ionic_angular_1.Modal.create(modals_1.AddUserModal, { type: this.name.toLowerCase(), name: this.term });
        myModal.onDismiss(function (data) {
            if (data) {
                data.name = helpers_1.getFullName(data.firstname, data.lastname, data.email);
                _this.dismiss(data);
            }
        });
        this.nav.present(myModal);
    };
    AjaxSelectModal.prototype.searchItems = function (searchbar) {
        var _this = this;
        this.items = this.data;
        var q = searchbar.value.trim();
        if (q.trim() == '' || this.busy) {
            if (q.trim() == '')
                this.is_empty = !this.items.length;
            return;
        }
        if (q.length < 3) {
            this.items = this.items.filter(function (v) { return v.name.toLowerCase().indexOf(q.toLowerCase()) > -1; });
            this.is_empty = !this.items.length;
        }
        else {
            var timer = setTimeout(function () { _this.busy = true; }, 500);
            this.getItems(q, timer);
        }
    };
    AjaxSelectModal.prototype.getItems = function (term, timer) {
        var _this = this;
        this.items = [];
        if (config_1.isSD && ~["location", "account"].indexOf(this.name.toLowerCase())) {
            term = term + "*";
        }
        this.apiData.getPaged(helpers_1.addp(this.url, "search", term), this.pager).subscribe(function (data) {
            if (data.length && !data[0].name) {
                var results = [];
                data.forEach(function (item) {
                    var name;
                    if (item.email)
                        name = helpers_1.getFullName(item.firstname, item.lastname, item.email, " ");
                    results.push({ id: item.id, name: name });
                });
                data = results;
            }
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            _this.is_empty = !data.length;
            if (!term) {
                _this.items = _this.data = data;
            }
            else
                _this.items = data;
            _this.count = data.length;
        }, function (error) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            console.log(error || 'Server error');
        });
    };
    AjaxSelectModal = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/modals/ajax-select/ajax-select.html',
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.NavParams, ionic_angular_1.Config, api_data_1.ApiData,
            ionic_angular_1.ViewController])
    ], AjaxSelectModal);
    return AjaxSelectModal;
}());
exports.AjaxSelectModal = AjaxSelectModal;
