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
var login_1 = require("../login/login");
var SkypePage = (function () {
    function SkypePage(nav, dataProvider) {
        this.nav = nav;
        this.dataProvider = dataProvider;
        this.is_skype_done = false;
    }
    SkypePage.prototype.onPageLoaded = function () {
        this.onLoginSkype();
    };
    SkypePage.prototype.onLoginSkype = function () {
        var _this = this;
        var skype = localStorage.getItem('skype') || "";
        try {
            var data = JSON.parse(skype);
            if (data && typeof data === "object") {
                this.dataProvider.loginSkype(data).subscribe(function (d) {
                    localStorage.setItem('skype', "");
                    _this.is_skype_done = true;
                    _this.nav.alert("Done! You can continue to chat in Skype ...");
                }, function (error) {
                    localStorage.setItem('skype', "");
                    _this.nav.alert(error, true);
                    console.log("error", error);
                });
            }
        }
        catch (e) {
            this.nav.alert('Cannot continue! Incorrect skype data', true);
        }
    };
    SkypePage.prototype.cancel_skype = function () {
        localStorage.setItem('skype', "");
        this.nav.setRoot(login_1.LoginPage, null, { animation: "wp-transition" });
    };
    SkypePage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/skype/skype.html',
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, data_provider_1.DataProvider])
    ], SkypePage);
    return SkypePage;
}());
exports.SkypePage = SkypePage;
