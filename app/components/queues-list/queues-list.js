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
var queue_tickets_1 = require("../../pages/queue-tickets/queue-tickets");
var pipes_1 = require("../../pipes/pipes");
var QueuesListComponent = (function () {
    function QueuesListComponent(nav) {
        this.nav = nav;
        this.is_empty = false;
    }
    QueuesListComponent.prototype.ngOnChanges = function (event) {
        if (!this.simple)
            return;
        if ("queues" in event) {
            if (event.queues.isFirstChange() && event.queues.currentValue !== null)
                return;
            this.is_empty = !event.queues.currentValue || event.queues.currentValue.length == 0;
        }
    };
    QueuesListComponent.prototype.goToQueueTicketsPage = function (queue) {
        this.nav.push(queue_tickets_1.QueueTicketsPage, queue);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], QueuesListComponent.prototype, "queues", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], QueuesListComponent.prototype, "simple", void 0);
    QueuesListComponent = __decorate([
        core_1.Component({
            selector: 'queues-list',
            templateUrl: 'build/components/queues-list/queues-list.html',
            directives: [ionic_angular_1.IONIC_DIRECTIVES],
            pipes: [pipes_1.MorePipe],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav])
    ], QueuesListComponent);
    return QueuesListComponent;
}());
exports.QueuesListComponent = QueuesListComponent;
