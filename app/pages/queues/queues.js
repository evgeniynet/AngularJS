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
var QueuesPage = (function () {
    function QueuesPage(nav, dataProvider) {
        this.nav = nav;
        this.dataProvider = dataProvider;
    }
    QueuesPage.prototype.onPageLoaded = function () {
        var _this = this;
        this.dataProvider.getQueueList().subscribe(function (data) {
            _this.queues = data;
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    QueuesPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/queues/queues.html',
            directives: [components_1.QueuesListComponent, components_1.ActionButtonComponent]
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, data_provider_1.DataProvider])
    ], QueuesPage);
    return QueuesPage;
}());
exports.QueuesPage = QueuesPage;
