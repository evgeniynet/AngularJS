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
var core_1 = require("@angular/core");
var modals_1 = require("../../pages/modals/modals");
var helpers_1 = require("../../directives/helpers");
require("rxjs");
var alertLimit = 10;
var LocationListComponent = (function () {
    function LocationListComponent(nav, apiData, config) {
        this.nav = nav;
        this.apiData = apiData;
        this.config = config;
        this.list = {};
        this.onChanged = new core_1.EventEmitter(false);
        this.init = true;
        this.selected = {};
    }
    LocationListComponent.prototype.ngOnInit = function () {
        if (!this.config.current.is_location_tracking) {
            this.list.hidden = true;
            return;
        }
        this.name = (this.config.current.names[this.list.name] || {}).s || this.list.name;
        if (this.list.url) {
            this.url = this.list.url;
            if (this.preload) {
                this.loadData(false);
            }
        }
    };
    LocationListComponent.prototype.open = function () {
        this.loadData(true);
    };
    LocationListComponent.prototype.loadData = function (show) {
        var _this = this;
        if (this.url != this.list.url || !this.list.items || this.list.items.length == 0) {
            if (this.list.url) {
                this.apiData.get(helpers_1.addp(this.list.url, "is_tree", "true")).subscribe(function (data) {
                    _this.list.items = data;
                    _this.proceed_list(show);
                    _this.url = _this.list.url;
                }, function (error) {
                    _this.error("Cannot get " + _this.name + " list! Error: " + error);
                    console.log(error || 'Server error');
                });
            }
            else
                this.error(this.name + ' list is empty!');
        }
        else {
            this.proceed_list(show);
        }
    };
    LocationListComponent.prototype.error = function (message) {
        this.nav.alert(message, true);
    };
    LocationListComponent.prototype.proceed_list = function (show) {
        if (!this.list.items || this.list.items.length == 0) {
            this.list.value = "Default (nothing to select)";
            return;
        }
        if (show) {
            if (this.list.items[0].name != "Default (no selection)")
                this.list.items.splice(0, 0, { hierarchy_level: 0, id: 0, is_active: true, is_lastchild: true, name: "Default (no selection)" });
            this.openModal();
        }
    };
    LocationListComponent.prototype.emit_changed = function (value) {
        value.name = this.findPath(" ", this.list.items, value.id);
        value.type = "location";
        this.onChanged.emit(value);
    };
    LocationListComponent.prototype.findPath = function (path, array, id) {
        if (typeof array != 'undefined' && array) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].id == id)
                    return array[i].name;
                var path = this.findPath(path, array[i].sub, id);
                if (path != null) {
                    return array[i].name + " / " + path;
                }
            }
        }
        return null;
    };
    LocationListComponent.prototype.openRadio = function () {
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
    LocationListComponent.prototype.openModal = function () {
        var _this = this;
        var myModal = ionic_angular_1.Modal.create(modals_1.TreeModal, this.list);
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
    ], LocationListComponent.prototype, "list", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], LocationListComponent.prototype, "preload", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], LocationListComponent.prototype, "onChanged", void 0);
    LocationListComponent = __decorate([
        core_1.Component({
            selector: 'location-list',
            templateUrl: 'build/components/location-list/location-list.html',
            directives: [ionic_angular_1.IONIC_DIRECTIVES]
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, api_data_1.ApiData, ionic_angular_1.Config])
    ], LocationListComponent);
    return LocationListComponent;
}());
exports.LocationListComponent = LocationListComponent;
