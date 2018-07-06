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
var core_1 = require("@angular/core");
var location_details_1 = require("../../pages/location-details/location-details");
var pipes_1 = require("../../pipes/pipes");
var LocationsListComponent = (function () {
    function LocationsListComponent(nav, config) {
        this.nav = nav;
        this.config = config;
        this.is_empty = false;
    }
    LocationsListComponent.prototype.itemTapped = function (event, location) {
        this.nav.push(location_details_1.LocationDetailsPage, location);
    };
    LocationsListComponent.prototype.ngOnChanges = function (event) {
        if (!this.simple)
            return;
        if ("locations" in event) {
            if (event.locations.isFirstChange() && event.locations.currentValue !== null)
                return;
            this.is_empty = !event.locations.currentValue || event.locations.currentValue.length == 0;
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], LocationsListComponent.prototype, "locations", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], LocationsListComponent.prototype, "simple", void 0);
    LocationsListComponent = __decorate([
        core_1.Component({
            selector: 'locations-list',
            templateUrl: 'build/components/locations-list/locations-list.html',
            directives: [ionic_angular_1.IONIC_DIRECTIVES],
            pipes: [pipes_1.MorePipe],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.Config])
    ], LocationsListComponent);
    return LocationsListComponent;
}());
exports.LocationsListComponent = LocationsListComponent;
