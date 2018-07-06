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
var data_provider_1 = require("../../providers/data-provider");
var login_1 = require("../login/login");
var organizations_1 = require("../organizations/organizations");
var modals_1 = require("../modals/modals");
var SignupPage = (function () {
    function SignupPage(nav, dataProvider, config, events) {
        this.nav = nav;
        this.dataProvider = dataProvider;
        this.config = config;
        this.events = events;
        this.login = {};
        this.is_force_registration = false;
    }
    SignupPage.prototype.onPageLoaded = function () {
        this.is_force_registration = false;
    };
    SignupPage.prototype.getUrl = function (name) {
        this.login.name = name.value || "";
        this.login.url = name.value ? name.value.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '') : "";
    };
    SignupPage.prototype.onSignup = function (form) {
        var _this = this;
        if (form.valid) {
            var data = {
                "name": form.value.name,
                "email": form.value.email,
                "url": form.value.url,
                "is_force_registration": this.is_force_registration,
                "is_force_redirect": false,
                "firstname": form.value.firstname,
                "lastname": form.value.lastname,
                "password": form.value.password,
                "password_confirm": form.value.password_confirm,
                "how": form.value.how,
                "note": localStorage.getItem("isPhonegap") === "true" ? "registered by iPhone app" : "registered from m.sherpadesk.com"
            };
            this.dataProvider.registerOrganization(data).subscribe(function (data) {
                if (!data.api_token) {
                    _this.nav.setRoot(login_1.LoginPage, null, { animation: "wp-transition" });
                    return;
                }
                if (!data.organization || !data.instance) {
                    _this.nav.setRoot(organizations_1.OrganizationsPage, null, { animation: "wp-transition" });
                    return;
                }
                _this.config.setCurrent({
                    "key": data.api_token,
                    "org": data.organization,
                    "instance": data.instance
                });
                helpers_1.spicePixelTrackConversion();
                helpers_1.getappTrackConversion(form.value.url);
                _this.nav.alert("Thanks for registration! You are redirected to new org now ...");
                setTimeout(function () { return _this.events.publish("config:get", true); }, 3000);
            }, function (error) {
                if (~error.toString().indexOf("409")) {
                    _this.presentConfirm();
                }
                else
                    _this.nav.alert(error, true);
            });
        }
        else
            this.nav.alert('Please fill the form!', true);
    };
    SignupPage.prototype.presentConfirm = function () {
        var _this = this;
        var alert = ionic_angular_1.Alert.create({
            title: "Wait. Haven't I seen you?",
            subTitle: "This email is already in use.",
            message: 'Would you like to',
            cssClass: "hello",
            buttons: [
                {
                    text: 'Login',
                    role: 'cancel',
                    handler: function () {
                        localStorage.setItem('username', _this.login.email || "");
                        alert.dismiss().then(function () {
                            _this.nav.setRoot(login_1.LoginPage, null, { animation: "wp-transition" });
                        });
                        return false;
                    }
                },
                {
                    text: 'Create New Org',
                    handler: function () {
                        var navTransition = alert.dismiss();
                        _this.is_force_registration = true;
                        navTransition.then(function () {
                            var form = { valid: true, value: _this.login };
                            _this.onSignup(form);
                        });
                        return false;
                    }
                }
            ]
        });
        this.nav.present(alert);
    };
    SignupPage.prototype.gotoPrivacy = function () {
        this.nav.present(ionic_angular_1.Modal.create(modals_1.PrivacyModal));
    };
    SignupPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/signup/signup.html',
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, data_provider_1.DataProvider, ionic_angular_1.Config, ionic_angular_1.Events])
    ], SignupPage);
    return SignupPage;
}());
exports.SignupPage = SignupPage;
