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
var tech_tickets_1 = require("../../pages/tech-tickets/tech-tickets");
var pipes_1 = require("../../pipes/pipes");
var TechniciansListComponent = (function () {
    function TechniciansListComponent(nav, config) {
        this.nav = nav;
        this.config = config;
        this.is_empty = false;
    }
    TechniciansListComponent.prototype.itemTapped = function (event, account) {
    };
    TechniciansListComponent.prototype.goToTechTicketsPage = function (technician) {
        this.nav.push(tech_tickets_1.TechTicketsPage, technician);
    };
    TechniciansListComponent.prototype.ngOnChanges = function (event) {
        if (!this.simple)
            return;
        if ("technicians" in event) {
            if (event.technicians.isFirstChange() && event.technicians.currentValue !== null)
                return;
            this.is_empty = !event.technicians.currentValue || event.technicians.currentValue.length == 0;
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], TechniciansListComponent.prototype, "technicians", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], TechniciansListComponent.prototype, "simple", void 0);
    TechniciansListComponent = __decorate([
        core_1.Component({
            selector: 'techs-list',
            templateUrl: 'build/components/techs-list/techs-list.html',
            directives: [ionic_angular_1.IONIC_DIRECTIVES],
            pipes: [pipes_1.MorePipe],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.Config])
    ], TechniciansListComponent);
    return TechniciansListComponent;
}());
exports.TechniciansListComponent = TechniciansListComponent;
