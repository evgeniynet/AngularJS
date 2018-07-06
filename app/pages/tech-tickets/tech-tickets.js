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
var modals_1 = require("../modals/modals");
var ticket_details_1 = require("../ticket-details/ticket-details");
var tickets_list_1 = require("../../components/tickets-list/tickets-list");
var TechTicketsPage = (function () {
    function TechTicketsPage(nav, navParams, view, config) {
        this.nav = nav;
        this.navParams = navParams;
        this.view = view;
        this.config = config;
        this.technician = this.navParams.data;
        console.log(this.technician);
    }
    TechTicketsPage.prototype.onPageWillEnter = function () {
        this.view.setBackButtonText('');
    };
    TechTicketsPage.prototype.addTicket = function () {
        var _this = this;
        var myModal = ionic_angular_1.Modal.create(modals_1.TicketCreatePage, { 'tech': { id: this.technician.id, name: this.technician.lastname + " " + this.technician.firstname } });
        myModal.onDismiss(function (data1) {
            if (data1)
                setTimeout(function () {
                    _this.technician.tickets_count += 1;
                    _this.nav.push(ticket_details_1.TicketDetailsPage, data1);
                }, 500);
        });
        this.nav.present(myModal);
    };
    TechTicketsPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/tech-tickets/tech-tickets.html',
            directives: [tickets_list_1.TicketsListComponent],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.NavParams, ionic_angular_1.ViewController, ionic_angular_1.Config])
    ], TechTicketsPage);
    return TechTicketsPage;
}());
exports.TechTicketsPage = TechTicketsPage;
