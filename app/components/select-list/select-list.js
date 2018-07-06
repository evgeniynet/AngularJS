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
var api_data_1 = require("../../providers/api-data");
var helpers_1 = require("../../directives/helpers");
var core_1 = require("@angular/core");
var modals_1 = require("../../pages/modals/modals");
var alertLimit = 5;
var SelectListComponent = (function () {
    function SelectListComponent(nav, apiData, config) {
        this.nav = nav;
        this.apiData = apiData;
        this.config = config;
        this.is_enabled = true;
        this.onChanged = new core_1.EventEmitter(false);
        this.selected = {};
        this.init = true;
        this.name = "";
        this.list = {};
    }
    SelectListComponent.prototype.ngOnInit = function () {
        var listname = this.list.name.toLowerCase();
        if ((listname == "project" && !this.config.current.is_project_tracking) ||
            (listname == "location" && !this.config.current.is_location_tracking) ||
            (listname == "priority" && !this.config.current.is_priorities_general) ||
            (listname == "account" && !this.config.current.is_account_manager) ||
            (listname == "level" && (!this.config.current.is_ticket_levels || (this.config.current.is_restrict_tech_escalate && !this.config.current.user.is_admin))) ||
            ((listname == "resolution" || listname == "category") && !this.config.current.is_resolution_tracking)) {
            this.list.hidden = true;
        }
        this.is_enabled = !this.list.is_disabled;
        if (this.list.hidden)
            return;
        if (listname == "tech" || listname == "user")
            this.name = (this.config.current.names[listname] || {}).a;
        else
            this.name = (this.config.current.names[listname] || {}).s || this.list.name;
        if (this.list.url) {
            this.url = this.list.url;
            if (this.preload) {
                this.loadData(false);
            }
        }
    };
    SelectListComponent.prototype.me = function () {
        var he = this.config.getCurrent("user");
        var value = {
            id: he.user_id,
            name: helpers_1.getFullName(he.firstname, he.lastname, he.email)
        };
        this.emit_changed(value);
    };
    SelectListComponent.prototype.open = function () {
        this.loadData(true);
    };
    SelectListComponent.prototype.loadData = function (show) {
        var _this = this;
        if (this.url != this.list.url || !this.list.items || this.list.items.length == 0) {
            if (this.list.url) {
                var loading_1 = null;
                if (show) {
                    loading_1 = ionic_angular_1.Loading.create({
                        content: "Please wait...",
                        dismissOnPageChange: true
                    });
                    this.nav.present(loading_1);
                }
                this.apiData.get(this.list.url).subscribe(function (data) {
                    _this.list.items = data;
                    if (show) {
                        loading_1.dismiss();
                    }
                    _this.proceed_list(show);
                    _this.url = _this.list.url;
                }, function (error) {
                    if (show)
                        loading_1.dismiss();
                    _this.error("Cannot get " + _this.name + " list! Error: " + error);
                    console.log(error || 'Server error');
                });
            }
            else {
                this.list.hidden = true;
                this.error(this.name + ' list is empty!');
            }
        }
        else
            this.proceed_list(show);
    };
    SelectListComponent.prototype.error = function (message) {
        this.nav.alert(message, true);
    };
    SelectListComponent.prototype.proceed_list = function (show) {
        var _this = this;
        if (!this.list.items || this.list.items.length == 0) {
            this.list.value = "Default (nothing to select)";
            return;
        }
        if (show) {
            if (!this.list.items[0].name) {
                var results = [];
                this.list.items.forEach(function (item) {
                    var name;
                    var id = item.id;
                    if (item.email)
                        name = helpers_1.getFullName(item.firstname, item.lastname, item.email, _this.isbutton ? "" : " ");
                    else if (item.number)
                        name = "#" + item.number + ": " + item.subject;
                    else if (item.prepaid_pack_id) {
                        name = item.prepaid_pack_name;
                        id = item.prepaid_pack_id;
                    }
                    results.push({ id: id, name: name });
                });
                this.list.items = results;
            }
            this.openModal();
        }
    };
    SelectListComponent.prototype.emit_changed = function (value) {
        this.list.value = value.name;
        value.type = this.list.name.split(' ').join('').toLowerCase();
        this.onChanged.emit(value);
    };
    SelectListComponent.prototype.openRadio = function () {
        var _this = this;
        var title = this.name;
        var alert = ionic_angular_1.Alert.create({
            title: 'Choose ' + title,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'OK',
                    handler: function (data) {
                        if (data) {
                            _this.selected = data;
                            _this.emit_changed(data);
                        }
                    }
                }
            ]
        });
        this.list.items.forEach(function (item) {
            alert.addInput({
                type: 'radio',
                label: item.name,
                value: item,
            });
        });
        this.nav.present(alert);
    };
    SelectListComponent.prototype.openModal = function () {
        var _this = this;
        this.list.isbutton = this.isbutton;
        var len = this.list.items.length || 0;
        var modal = len >= 25 && len % 25 == 0 ? modals_1.InfinitySelectModal : modals_1.BasicSelectModal;
        var myModal = ionic_angular_1.Modal.create(modal, this.list);
        myModal.onDismiss(function (data) {
            if (data.name) {
                _this.selected = data;
                _this.emit_changed(data);
            }
        });
        this.nav.present(myModal);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SelectListComponent.prototype, "list", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], SelectListComponent.prototype, "isbutton", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], SelectListComponent.prototype, "is_enabled", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], SelectListComponent.prototype, "is_me", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], SelectListComponent.prototype, "preload", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], SelectListComponent.prototype, "ajax", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], SelectListComponent.prototype, "onChanged", void 0);
    SelectListComponent = __decorate([
        core_1.Component({
            selector: 'select-list',
            templateUrl: 'build/components/select-list/select-list.html',
            directives: [ionic_angular_1.IONIC_DIRECTIVES]
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, api_data_1.ApiData, ionic_angular_1.Config])
    ], SelectListComponent);
    return SelectListComponent;
}());
exports.SelectListComponent = SelectListComponent;
