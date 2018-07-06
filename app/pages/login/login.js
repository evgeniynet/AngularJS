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
var config_1 = require("../../providers/config");
var helpers_1 = require("../../directives/helpers");
var data_provider_1 = require("../../providers/data-provider");
var organizations_1 = require("../organizations/organizations");
var signup_1 = require("../signup/signup");
var LoginPage = (function () {
    function LoginPage(nav, dataProvider, config, events) {
        this.nav = nav;
        this.dataProvider = dataProvider;
        this.config = config;
        this.events = events;
        this.google_action = "";
        this.busy = false;
        this.is_sd = config_1.isSD;
        this.fileDest = { ticket: "wonvhr" };
        this.skype = localStorage.getItem('skype') || "";
        if (localStorage.getItem("isPhonegap") !== "true")
            this.google_action = config_1.ApiSite + 'auth/auth0';
        if (localStorage.getItem("isExtension") === "true")
            window.top.postMessage("logout", "*");
        events.publish("app:logout");
    }
    LoginPage.prototype.onPageLoaded = function () {
        document.title = config_1.AppTitle + "Mobile App";
        this.login = { username: localStorage.getItem('username') || "" };
    };
    LoginPage.prototype.onLogin = function (form) {
        var _this = this;
        this.busy = true;
        if (form.valid) {
            localStorage.setItem('username', form.value.email || "");
            this.dataProvider.checkLogin(form.value.email, form.value.password).subscribe(function (data) {
                _this.config.setCurrent({ "key": data.api_token });
                _this.nav.setRoot(organizations_1.OrganizationsPage, null, { animation: "wp-transition" });
            }, function (error) {
                var message = 'There was a problem with your login.  Check your login and password.';
                if (form.value.email && ~form.value.email.indexOf("@gmail.com")) {
                    message = "Wrong Password, maybe you used Google password";
                }
                _this.nav.alert(message, true);
                _this.login.password = "";
                _this.busy = false;
            });
        }
        else {
            this.nav.alert('Please enter email and password!', true);
            this.busy = false;
        }
    };
    LoginPage.prototype.ngAfterViewInit = function () {
    };
    LoginPage.prototype.cancel_skype = function () {
        localStorage.setItem('skype', "");
        this.skype = "";
    };
    LoginPage.prototype.support = function () {
        helpers_1.openURLsystem("https://support." + config_1.Site + "portal/");
    };
    LoginPage.prototype.onGoogleSignin = function () {
        var _this = this;
        if ("true" === localStorage.getItem("isExtension")) {
            this.nav.alert("Please finish login with Google in new window (Google requirement)\n and start Extension again.");
            setTimeout(function () {
                window.ww = window.open(config_1.ApiSite + "auth/auth0", "_blank", "");
                window.auth_google = !!window.ww;
                if (!window.auth_google)
                    _this.nav.alert("Pop-up was blocked, please click again to login.");
            }, window.auth_google ? 0 : 3000);
        }
        else if ("true" === localStorage.getItem("isPhonegap")) {
            var url = config_1.ApiSite + "auth/auth0?ios_action=" + (localStorage.isIos || localStorage.isIosStatus || "");
            window.win = null;
            window.nameInterval = null;
            window.onExit = function () {
                clearInterval(window.nameInterval), window.win.close();
                location.reload(true);
            };
            window.win = window.open(url, "_blank", "location=no");
            window.win.addEventListener("loadstop", function () {
                window.nameInterval = setInterval(function () {
                    window.win.executeScript({
                        code: "localStorage.getItem('current')"
                    }, function (data) {
                        var e = data[0];
                        if (e) {
                            localStorage.current = e;
                            var i = JSON.parse(e || "null") || {};
                            if (i.org && i.instance && i.key)
                                window.onExit();
                        }
                    });
                }, 1000);
            });
            window.win.addEventListener("exit", function () {
                window.onExit();
            });
        }
        else
            window.location.href = config_1.ApiSite + "auth/auth0";
    };
    LoginPage.prototype.onSignup = function () {
        this.nav.push(signup_1.SignupPage, null, { animation: "wp-transition" });
    };
    LoginPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/login/login.html',
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, data_provider_1.DataProvider, ionic_angular_1.Config, ionic_angular_1.Events])
    ], LoginPage);
    return LoginPage;
}());
exports.LoginPage = LoginPage;
