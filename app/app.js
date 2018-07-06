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
var core_1 = require("@angular/core");
var ionic_angular_1 = require("ionic-angular");
var providers = require("./providers/providers");
var config_1 = require("./providers/config");
var mocks_1 = require("./providers/mocks");
var helpers = require("./directives/helpers");
var pages = require("./pages/pages");
var modals = require("./pages/modals/modals");
var MyApp = (function () {
    function MyApp(app, platform, config, events, menu, ticketProvider, dataProvider) {
        var _this = this;
        this.app = app;
        this.platform = platform;
        this.config = config;
        this.events = events;
        this.menu = menu;
        this.ticketProvider = ticketProvider;
        this.dataProvider = dataProvider;
        this.is_offline = false;
        this.is_phonegap = false;
        this.img = new Image();
        if (!this.isStorage()) {
            console.log("Please enable coockies!");
            return;
        }
        this.is_phonegap = localStorage.getItem("isPhonegap") === "true";
        this.initializeApp();
        this.ExtendConfig();
        setTimeout(function () {
            return _this.ExtendNavAlert();
        }, 0);
        (document.getElementsByTagName("ion-loading")[0] || {}).outerHTML = '';
        var fake = document.getElementsByTagName("ion-app1");
        if (fake && fake[0]) {
            fake[0].classList.add("loaded");
            setTimeout(function () { document.getElementsByTagName("ion-app1")[0].outerHTML = ''; }, 1500);
        }
        setTimeout(function () { if (window.dash || "")
            localStorage.setItem("dash_cache", window.dash || ""); }, 7000);
        var ios_action = localStorage.getItem('ios_action') || "";
        var key = helpers.getParameterByName('t');
        var email = helpers.getParameterByName('e');
        var platform_string = helpers.getParameterByName('ionicPlatform');
        if (key) {
            config.clearCurrent(key);
            localStorage.setItem("isGoogle", "true");
            localStorage.setItem('username', (email || "").replace("#", ""));
            config.saveCurrent();
            this.rootPage = pages.OrganizationsPage;
            helpers.cleanQuerystring('ionicPlatform', platform_string);
            return;
        }
        else {
            var error = helpers.getParameterByName('f');
            if (error) {
                setTimeout(function () { return _this.nav.alert(error, true); }, 3000);
            }
            localStorage.setItem("isGoogle", "");
        }
        helpers.cleanQuerystring('ionicPlatform', platform_string);
        if (config_1.dontClearCache)
            config.setCurrent(mocks_1.MOCKS["config"]);
        else if (!config.getCurrent("is_logged")) {
            this.rootPage = pages.LoginPage;
            return;
        }
        if (!config.getCurrent("is_chosen")) {
            this.rootPage = pages.OrganizationsPage;
            return;
        }
        setTimeout(function () { return _this.redirect(true); }, config_1.dontClearCache ? 1000 : 0);
    }
    MyApp.prototype.redirect = function (isRedirect) {
        var _this = this;
        this.dataProvider.getConfig().subscribe(function (data) {
            var skype = localStorage.getItem('skype') || "";
            if (skype) {
                _this.redirect_skype(data);
                return;
            }
            _this.onLine(true);
            clearInterval(_this.interval);
            _this.interval = setInterval(function () { return _this.redirect(); }, 5 * 60 * 1000);
            _this.redirect_logic(isRedirect, data);
        }, function (error) {
            clearInterval(_this.interval);
            _this.nav.alert(error || 'Server error', true);
            if (_this.is_offline && _this.config.getCurrent("user").firstname) {
                _this.redirect_logic(isRedirect, _this.config.getCurrent());
            }
            else {
                _this.config.setCurrent({ org: "" });
            }
        });
    };
    MyApp.prototype.ok = function (value) {
    };
    MyApp.prototype.fail = function (error) { alert(error); };
    MyApp.prototype.initOrgPreferences = function (value) {
        if (window.cordova) {
            var prefs = (window.plugins || {}).appPreferences;
            if (prefs) {
                var suitePrefs = prefs.iosSuite("group.io.sherpadesk.mobile");
                suitePrefs.store(this.ok, this.fail, 'org', value);
            }
            if (window.sswc) {
                var didReceiveMessage = function (message) {
                    var obj = JSON.parse(message);
                    console.log(obj.message);
                };
                var msgSendSuccess = function () {
                    console.log("Message send success");
                };
                var failure = function () {
                    console.log("Error");
                };
                var success = function () {
                    window.sswc.messageReceiver(didReceiveMessage, failure);
                    window.sswc.sendMessage(value, msgSendSuccess, failure);
                };
                window.sswc.init(success, failure);
                console.log("window.sswc", window.sswc);
            }
            else
                console.log("no watch");
        }
    };
    MyApp.prototype.redirect_skype = function (data) {
        this.config.setCurrent(data);
        this.nav.setRoot(pages.SkypePage, null, { animation: "wp-transition" });
    };
    MyApp.prototype.redirect_logic = function (isRedirect, data) {
        this.config.setCurrent(data);
        if (this.config.current.user.is_techoradmin)
            this.pages = [
                { title: 'Dashboard', component: pages.DashboardPage, icon: "speedometer", is_active: true },
                { title: data.names.ticket.p, component: pages.TicketsPage, icon: "create", is_active: true },
                { title: 'Timelogs', component: pages.TimelogsPage, icon: "md-time", is_active: this.config.current.is_time_tracking },
                { title: data.names.account.p, component: pages.AccountsPage, icon: "people", is_active: this.config.current.is_account_manager },
                { title: data.names.location.p, component: pages.LocationsPage, icon: "navigate", is_active: this.config.current.is_location_tracking },
                { title: data.names.tech.p, component: pages.TechniciansPage, icon: "people-outline", is_active: true },
                { title: 'Invoices', component: pages.InvoicesPage, icon: "card", is_active: this.config.current.is_time_tracking && this.config.current.is_invoice },
                { title: 'Queues', component: pages.QueuesPage, icon: "md-list-box", is_active: this.config.current.is_unassigned_queue && (!this.config.current.user.is_limit_assigned_tkts || this.config.current.user.is_admin) },
                { title: 'ToDos', component: pages.TodosPage, icon: "list-box", is_active: this.config.current.is_todos },
                { title: 'Switch Org', component: pages.OrganizationsPage, icon: "md-swap", is_active: this.config.current.is_multiple_org },
                { title: 'Signout', component: pages.LoginPage, icon: "md-log-in", is_active: true },
                { title: 'Full App', component: null, icon: "md-share-alt", is_active: true },
            ];
        else
            this.pages = [
                { title: data.names.ticket.p, component: pages.TicketsPage, icon: "create", is_active: true },
                { title: 'Switch Org', component: pages.OrganizationsPage, icon: "md-swap", is_active: this.config.current.is_multiple_org },
                { title: 'Signout', component: pages.LoginPage, icon: "md-log-in", is_active: true },
                { title: 'Full App', component: null, icon: "md-share-alt", is_active: true },
            ];
        if (localStorage.getItem("isPhonegap") === "true")
            this.initOrgPreferences(this.config.current.org + "-" + this.config.current.instance + ":" + this.config.current.key);
        if (isRedirect && localStorage.getItem("isExtension") === "true") {
            var loginStr = "login?t=" + this.config.current.key +
                "&o=" + this.config.current.org +
                "&i=" + this.config.current.instance;
            window.top.postMessage(loginStr, "*");
        }
        var appVer = localStorage.getItem("version");
        if (appVer !== data.mobile_ver && Number(data.mobile_ver) > Number(appVer))
            this.presentConfirm(data.mobile_ver, isRedirect);
        else
            this.force_redirect(isRedirect);
    };
    MyApp.prototype.force_redirect = function (isRedirect) {
        if (isRedirect) {
            var param = null;
            var ticket = localStorage.getItem('loadTicketNumber') || '';
            if (ticket) {
                localStorage.setItem('loadTicketNumber', '');
                localStorage.setItem('loadOrgKey', "");
                param = { key: ticket };
            }
            var page = this.config.current.user.is_techoradmin && !ticket ? pages.DashboardPage : pages.TicketsPage;
            this.nav.setRoot(page, param, { animation: "wp-transition" });
        }
    };
    MyApp.prototype.presentConfirm = function (version, isRedirect) {
        var _this = this;
        localStorage.setItem("version", version);
        this.config.saveCurrent();
        var alert = ionic_angular_1.Alert.create({
            title: "There is a new update available!",
            message: 'Page will reload in 2 seconds',
            cssClass: "hello",
            buttons: [
                {
                    text: "Yes, do it now",
                    role: 'cancel',
                    handler: function () {
                        var element1 = document.createElement("script");
                        element1.src = config_1.MobileSite + "build/js/app.js?_d=" + Date.now();
                        document.body.appendChild(element1);
                        setTimeout(function () { return location.reload(true); }, 2000);
                    }
                },
                {
                    text: "No, I'll do it later",
                    handler: function () {
                        alert.dismiss().then(function () {
                            _this.force_redirect(isRedirect);
                        });
                        return false;
                    }
                }
            ]
        });
        this.nav.present(alert);
    };
    MyApp.prototype.isStorage = function () {
        var mod = 'modernizr';
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        }
        catch (e) {
            var toast = ionic_angular_1.Toast.create({
                message: "Please enable Cookies to work with site!",
                enableBackdropDismiss: false,
                showCloseButton: true,
                cssClass: "toast-error"
            });
            this.nav.present(toast);
            return false;
        }
    };
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            if (localStorage.getItem("isPhonegap") === "true") {
                console.log('cordova ready');
            }
            window.addEventListener('online', function () { return _this.onLine(true); });
            window.addEventListener('offline', function () { return _this.onLine(false); });
            document.addEventListener('handle', function (e) { return _this.handle(e); }, false);
        });
    };
    MyApp.prototype.handle = function (e) {
        var goto = e.detail;
        var key = Object.keys(goto)[0];
        var page;
        var param = {};
        var is_modal = false;
        switch (key) {
            case "ticket":
                if (!this.config.getCurrent("is_logged"))
                    localStorage.setItem('loadTicketNumber', goto[key]);
                else {
                    page = pages.TicketsPage;
                    param = { key: goto[key] };
                }
                break;
            case "add_time":
                is_modal = true;
                page = pages.TimelogPage;
                break;
            case "add_tkt":
                is_modal = true;
                page = modals.TicketCreatePage;
                break;
            case "list":
                is_modal = true;
                page = pages.TicketsPage;
                param = { tab: goto[key] };
                break;
            default:
                break;
        }
        if (page) {
            if (is_modal)
                this.nav.push(page, param, { animation: "wp-transition" });
            else {
                this.nav.setRoot(page, param, { animation: "wp-transition" });
            }
        }
    };
    MyApp.prototype.checkConnection = function () {
        var _this = this;
        if (navigator.onLine) {
            if (localStorage.getItem("isPhonegap") !== "true") {
                this.img.onload = function () { return _this.onLine(true); };
                this.img.onerror = function () { return _this.onLine(false); };
                this.img.src = config_1.MobileSite + "img/select_arrow.png?rand=" + Math.random();
            }
        }
        else {
            this.onLine(false);
        }
    };
    MyApp.prototype.onLine = function (isOnline) {
        var _this = this;
        if (this.is_offline != !isOnline) {
            if (this.offlineTimer && this.offlineTimer.runCount >= 1)
                this.nav.alert(!isOnline ? "Sorry! You are offline now. Please check your internet connection!" : "Hey! You online now! Try again your action", !isOnline);
            if (localStorage.getItem("isPhonegap") !== "true") {
                if (!isOnline) {
                    clearInterval(this.offlineTimer);
                    this.offlineTimer = null;
                    this.offlineTimer = setInterval(function () { return _this.checkConnection(); }, 10 * 1000);
                }
                else {
                    clearInterval(this.offlineTimer);
                    this.offlineTimer = null;
                }
            }
        }
        this.is_offline = !isOnline;
    };
    MyApp.prototype.openPage = function (page, param) {
        this.menu.close();
        if (!page.component) {
            var curr = this.config.getCurrent();
            helpers.fullapplink(config_1.AppSite, "", curr.instance, curr.org);
            return;
        }
        if (this.interval && (page.component == pages.LoginPage || page.component == pages.OrganizationsPage))
            clearInterval(this.interval);
        if (page.index) {
            this.nav.setRoot(page.component || page, { tabIndex: page.index });
        }
        else {
            this.nav.setRoot(page.component || page);
        }
    };
    MyApp.prototype.ngOnInit = function () {
        this.subscribeToEvents();
    };
    MyApp.prototype.ngOnDestroy = function () {
        this.unsubscribeToEvents();
        clearInterval(this.offlineTimer);
        clearInterval(this.interval);
        if (localStorage.getItem("isPhonegap") === "true") {
            this.disconnectSubscription.unsubscribe();
            this.connectSubscription.unsubscribe();
        }
    };
    MyApp.prototype.logout = function (key) {
        this.config.clearCurrent(key);
        if (localStorage.getItem("isPhonegap") === "true")
            this.initOrgPreferences("");
    };
    MyApp.prototype.subscribeToEvents = function () {
        var _this = this;
        this.events.subscribe('login:failed', function () {
            _this.logout();
            _this.openPage({ component: pages.LoginPage });
        });
        this.events.subscribe('app:logout', function (data) {
            _this.logout(data && data[0]);
        });
        this.events.subscribe('connection:error', function (data) {
            _this.checkConnection();
        });
        this.events.subscribe('config:get', function (data) {
            _this.redirect(data);
        });
    };
    MyApp.prototype.unsubscribeToEvents = function () {
        this.events.unsubscribe('login:failed', null);
        this.events.unsubscribe('connection:error', null);
        this.events.unsubscribe('config:get', null);
        this.events.unsubscribe('app:logout', null);
    };
    MyApp.prototype.ExtendConfig = function () {
        localStorage.setItem('isExtension', window.self !== window.top ? "true" : "");
        localStorage.setItem("version", config_1.appVersion);
        this.config.getCurrent = function (property) {
            var tconfig = this.current || JSON.parse(localStorage.getItem("current") || "null") || {};
            tconfig.is_logged = !!tconfig.key;
            tconfig.is_chosen = !!tconfig.instance && !!tconfig.org && !!tconfig.key;
            tconfig.is_online = !this.is_offline;
            var appVer = localStorage.getItem("version");
            tconfig.is_updated = !(appVer !== tconfig.mobile_ver && Number(tconfig.mobile_ver) > Number(appVer));
            if (!tconfig.stat)
                tconfig.stat = {};
            if (!tconfig.user)
                tconfig.user = {};
            if (!tconfig.recent)
                tconfig.recent = {};
            if (!tconfig.cache)
                tconfig.cache = {};
            if (property)
                return tconfig[property] || "";
            return tconfig;
        };
        this.config.current = this.config.getCurrent();
        this.config.saveCurrent = function () {
            var curr = this.getCurrent();
            localStorage.setItem("current", JSON.stringify(curr));
            localStorage.setItem("dateformat", curr.user.date_format || 0);
            localStorage.setItem('timeformat', curr.user.time_format || 0);
            localStorage.setItem('currency', curr.currency || "$");
        };
        this.config.setCurrent = function (nconfig, nosave) {
            this.current = Object.assign({}, this.current || {}, nconfig || {});
            if (!nosave)
                this.saveCurrent();
        };
        this.config.clearCurrent = function (key) {
            localStorage.removeItem("dash_cache");
            localStorage.removeItem("current");
            this.setCurrent({ key: key || "", org: "", instance: "", user: {}, stat: {}, recent: {}, cache: {} });
        };
        this.config.getStat = function (property) {
            var stat = this.getCurrent("stat")[property];
            if (typeof stat == "undefined")
                return -1;
            return stat || {};
        };
        this.config.setStat = function (property, value) {
            this.current.stat[property] = value;
        };
        this.config.getRecent = function (property) {
            var recent = this.getCurrent("recent")[property];
            return recent || {};
        };
        this.config.setRecent = function (property, value) {
            if (!value)
                this.current.recent = Object.assign({}, this.current.recent || {}, property || {});
            else
                this.current.recent[property] = value;
        };
        this.config.getCache = function (property) {
            var cache = this.getCurrent("cache")[property];
            if (typeof cache == "undefined")
                return [];
            return cache || {};
        };
        this.config.setCache = function (property, value) {
            this.current.cache[property] = value;
        };
    };
    MyApp.prototype.ExtendNavAlert = function () {
        this.nav.alert = function (message, isNeg) {
            var toast = ionic_angular_1.Toast.create({
                message: message,
                duration: isNeg ? 7000 : 3000,
                cssClass: isNeg ? "toast-error" : "toast-ok",
                showCloseButton: true,
                closeButtonText: "X"
            });
            this.present(toast);
        };
    };
    __decorate([
        core_1.ViewChild(ionic_angular_1.Nav),
        __metadata("design:type", ionic_angular_1.Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        ionic_angular_1.App({
            templateUrl: 'build/app.html',
            providers: [providers.ApiData, providers.DataProvider, providers.TicketProvider, providers.TimeProvider, providers.TodoProvider],
            prodMode: true,
            config: {
                tabbarPlacement: 'top',
                pageTransitionDelay: 0,
                prodMode: true,
                activator: "ripple",
                ios: {
                    activator: 'ripple'
                }
            }
        }),
        __metadata("design:paramtypes", [ionic_angular_1.IonicApp, ionic_angular_1.Platform, ionic_angular_1.Config, ionic_angular_1.Events, ionic_angular_1.MenuController, providers.TicketProvider, providers.DataProvider])
    ], MyApp);
    return MyApp;
}());
