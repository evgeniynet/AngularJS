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
var helpers_1 = require("../../../directives/helpers");
var modals_1 = require("../modals");
var InfinitySelectModal = (function () {
    function InfinitySelectModal(nav, navParams, config, apiData, viewCtrl) {
        this.nav = nav;
        this.navParams = navParams;
        this.config = config;
        this.apiData = apiData;
        this.viewCtrl = viewCtrl;
        this.isdefault_enabled = false;
        this.isnew_enabled = false;
        nav.swipeBackEnabled = false;
    }
    InfinitySelectModal.prototype.ngOnInit = function () {
        var _this = this;
        this.term = '';
        this.name = this.navParams.data.name || "List";
        this.isdefault_enabled = !~["user", "account", "tech", "task type"].indexOf(this.name.toLowerCase());
        this.isnew_enabled = !!~["user", "tech"].indexOf(this.name.toLowerCase());
        this.url = this.navParams.data.url || "";
        this.data = this.navParams.data.items || {};
        this.items = this.data;
        this.count = this.items.length;
        this.isbutton = this.navParams.data.isbutton;
        this.is_empty = false;
        this.pager = { page: ((this.count % 25 == 0) ? Math.max(this.count / 25 - 1, 0) : 0), limit: 25 };
        if (this.items.length === 0) {
            var timer = setTimeout(function () {
                _this.busy = true;
            }, 500);
            this.getItems("", null, timer);
        }
    };
    InfinitySelectModal.prototype.dismiss = function (item) {
        item = item || {};
        this.viewCtrl.dismiss(item);
    };
    InfinitySelectModal.prototype.invite = function () {
        var _this = this;
        var myModal = ionic_angular_1.Modal.create(modals_1.AddUserModal, { type: this.name.toLowerCase(), name: this.term });
        myModal.onDismiss(function (data) {
            {
                {
                    item.name;
                }
            }
            if (data) {
                data.name = helpers_1.getFullName(data.firstname, data.lastname, data.email);
                _this.dismiss(data);
            }
        });
        this.nav.present(myModal);
    };
    InfinitySelectModal.prototype.searchItems = function (searchbar) {
        var _this = this;
        this.items = this.data;
        var q = searchbar.value.trim();
        if (q.trim() == '' || this.busy) {
            if (q.trim() == '') {
                this.is_empty = !this.items.length;
                this.count = 25;
            }
            return;
        }
        this.date = Date.now();
        if (q.length < 3) {
            this.items = this.items.filter(function (v) { return v.name.toLowerCase().indexOf(q.toLowerCase()) > -1; });
            this.is_empty = !this.items.length;
            this.count = 25;
        }
        else {
            var timer = setTimeout(function () { _this.busy = true; }, 500);
            this.getItems(q, null, timer);
        }
    };
    InfinitySelectModal.prototype.getItems = function (term, infiniteScroll, timer) {
        var _this = this;
        var pager = { page: this.pager.page, limit: this.pager.limit };
        var sterm = term;
        if (!infiniteScroll) {
            this.pager.page = 0;
            pager.page = 0;
            this.items = [];
        }
        if (config_1.isSD && ~["location", "account"].indexOf(this.name.toLowerCase())) {
            sterm = term + "*";
        }
        this.apiData.getPaged(helpers_1.addp(this.url, "search", sterm), pager).subscribe(function (data) {
            var _a, _b;
            if (data.length && !data[0].name) {
                var results = [];
                data.forEach(function (item) {
                    var name;
                    if (item.email)
                        name = helpers_1.getFullName(item.firstname, item.lastname, item.email, _this.isbutton ? "" : " ");
                    else if (item.number)
                        name = "#" + item.number + ": " + item.subject;
                    results.push({ id: item.id, name: name });
                });
                data = results;
            }
            if (timer) {
                _this.is_empty = !data.length;
                clearTimeout(timer);
                _this.busy = false;
            }
            _this.count = 25;
            if (!term || term.length < 3) {
                if (timer) {
                    _this.data = data;
                }
                else
                    (_a = _this.data).push.apply(_a, data);
                _this.count = data.length;
                _this.searchItems({ value: term });
            }
            else if (data.length) {
                _this.count = data.length;
                (_b = _this.items).push.apply(_b, data);
            }
            else
                _this.items = _this.data;
            if (infiniteScroll) {
                infiniteScroll.complete();
            }
        }, function (error) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            console.log(error || 'Server error');
        });
    };
    InfinitySelectModal.prototype.doInfinite = function (infiniteScroll) {
        if (this.date && Date.now() - this.date < 1000) {
            infiniteScroll.complete();
            return;
        }
        if (this.is_empty || this.count < 25) {
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        this.getItems(this.term, infiniteScroll);
    };
    InfinitySelectModal = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/modals/infinity-select/infinity-select.html',
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.NavParams, ionic_angular_1.Config, api_data_1.ApiData,
            ionic_angular_1.ViewController])
    ], InfinitySelectModal);
    return InfinitySelectModal;
}());
exports.InfinitySelectModal = InfinitySelectModal;
