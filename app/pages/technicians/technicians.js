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
var components_1 = require("../../components/components");
var TechniciansPage = (function () {
    function TechniciansPage(nav, config, dataProvider) {
        this.nav = nav;
        this.config = config;
        this.dataProvider = dataProvider;
        this.LIMIT = 500;
    }
    TechniciansPage.prototype.onPageLoaded = function () {
        var _this = this;
        this.pager = { page: 0, limit: this.LIMIT };
        var timer = setTimeout(function () {
            _this.busy = true;
        }, 500);
        this.getItems(null, timer);
    };
    TechniciansPage.prototype.getItems = function (infiniteScroll, timer) {
        var _this = this;
        this.dataProvider.getTechniciansList(this.pager, true, true).subscribe(function (data) {
            var _a;
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
                _this.technicians = data;
            }
            else {
                (_a = _this.technicians).push.apply(_a, data);
                _this.config.current.stat.technicians += data.length;
            }
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
    TechniciansPage.prototype.doInfinite = function (infiniteScroll) {
        if (this.count < this.LIMIT) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        this.getItems(infiniteScroll, null);
    };
    TechniciansPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/technicians/technicians.html',
            directives: [components_1.TechniciansListComponent, components_1.ActionButtonComponent],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.Config, data_provider_1.DataProvider])
    ], TechniciansPage);
    return TechniciansPage;
}());
exports.TechniciansPage = TechniciansPage;
