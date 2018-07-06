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
var ticket_provider_1 = require("../../providers/ticket-provider");
var ticket_details_1 = require("../../pages/ticket-details/ticket-details");
var modals_1 = require("../../pages/modals/modals");
var helpers_1 = require("../../directives/helpers");
var pipes_1 = require("../../pipes/pipes");
var TicketsListComponent = (function () {
    function TicketsListComponent(nav, navParams, config, ticketProvider) {
        this.nav = nav;
        this.navParams = navParams;
        this.config = config;
        this.ticketProvider = ticketProvider;
        this.LIMIT = 6;
        this.is_empty = false;
        this.pager = { page: 0, limit: this.LIMIT };
    }
    TicketsListComponent.prototype.ngOnChanges = function (event) {
        return;
        if ("count" in event) {
            if (event.count.isFirstChange())
                return;
            this.count = event.count.currentValue;
            if (this.count < 1)
                this.is_empty = true;
            else {
                this.pager.limit = this.count;
                this.onLoad();
                this.is_empty = false;
            }
        }
    };
    TicketsListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.he = this.config.getCurrent("user");
        this.cachename = this.mode[0] + (this.mode[1] || "") + (this.mode[2] || "");
        this.cachelen = (this.ticketProvider._dataStore[this.cachename] || {}).length;
        if (this.mode[0] == "all") {
            this.pager.limit = this.LIMIT = 15;
        }
        if (this.preload && !this.cachelen) {
            setTimeout(function () {
                _this.onLoad();
            }, this.preload);
        }
        else
            this.onLoad();
    };
    TicketsListComponent.prototype.onLoad = function () {
        var _this = this;
        if (!this.mode)
            return;
        var stat = this.config.getStat("tickets")[this.mode[0]];
        this.count = !stat ? this.count : stat;
        if (this.count !== 0) {
            this.ticketProvider.getTicketsList(this.mode[0], this.mode[1], this.mode[2], this.pager);
            this.tickets = this.ticketProvider.tickets$[this.cachename];
            if (!this.ticketProvider._dataStore[this.cachename].length) {
                var timer = setTimeout(function () {
                    _this.busy = true;
                }, 500);
                this.tickets.subscribe(function (data) {
                    clearTimeout(timer);
                    _this.busy = false;
                    _this.is_empty = !data.length;
                });
            }
        }
        else {
            this.is_empty = true;
        }
    };
    TicketsListComponent.prototype.itemTapped = function (event, ticket, slidingItem) {
        if (event.srcElement.tagName.toUpperCase() != "ION-ITEM-SLIDING") {
            slidingItem.close();
            ticket.clicked = true;
            ticket.cachename = this.cachename;
            if (ticket.technician_email == this.he.email)
                ticket.is_new_tech_post = false;
            if (ticket.technician_email == this.he.email)
                ticket.is_new_user_post = false;
            this.nav.push(ticket_details_1.TicketDetailsPage, ticket);
        }
    };
    TicketsListComponent.prototype.addPost = function (ticket, slidingItem) {
        var _this = this;
        slidingItem.close();
        var prompt = ionic_angular_1.Alert.create({
            title: 'Add Response to #' + ticket.number,
            inputs: [
                {
                    name: 'note',
                    placeholder: 'Note'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Post',
                    handler: function (data) {
                        if (!data.note.trim())
                            return;
                        var post = helpers_1.htmlEscape(data.note.trim()).substr(0, 5000);
                        _this.ticketProvider.addTicketPost(ticket.id, post).subscribe(function (data) {
                            _this.nav.alert('Note added :)');
                        }, function (error) {
                            _this.nav.alert(error, true);
                            console.log(error || 'Server error');
                        });
                    }
                }
            ]
        });
        this.nav.present(prompt);
    };
    TicketsListComponent.prototype.closeTicket = function (ticket, slidingItem) {
        var _this = this;
        slidingItem.close();
        if (ticket.status == 'Closed') {
            this.reopenTicket(ticket);
            return;
        }
        var myModal = ionic_angular_1.Modal.create(modals_1.CloseTicketModal, ticket);
        myModal.onDismiss(function (data) {
            if (!data)
                return;
            _this.count -= data;
            _this.ticketProvider._dataStore[_this.cachename].splice(_this.ticketProvider._dataStore[_this.cachename].indexOf(ticket), 1);
            _this.ticketProvider.getTicketsList(_this.mode[0], _this.mode[1], _this.mode[2], { "limit": 25 });
            if (_this.count < 1)
                _this.is_empty = true;
            else {
                _this.is_empty = false;
            }
        });
        this.nav.present(myModal);
    };
    TicketsListComponent.prototype.reopenTicket = function (ticket) {
        var _this = this;
        var data = {
            "status": "open",
            "note_text": ""
        };
        this.ticketProvider.closeOpenTicket(ticket.key, data).subscribe(function (data) {
            _this.nav.alert('Ticket has been Reopened!');
            ticket.status = "Open";
        }, function (error) {
            _this.nav.alert(error, true);
            console.log(error || 'Server error');
        });
    };
    TicketsListComponent.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        if (this.is_empty || (this.count > 0 && (this.count < this.LIMIT)) || (this.cachelen > 0 && (this.cachelen >= this.count || this.cachelen < this.LIMIT))) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        var cachedlen = (this.ticketProvider._dataStore[this.cachename] || {}).length;
        this.ticketProvider.getTicketsList(this.mode[0], this.mode[1], this.mode[2], this.pager);
        this.tickets.subscribe(function (data) {
            infiniteScroll.complete();
            var len = data.length;
            infiniteScroll.enable(!(cachedlen == len || len % _this.LIMIT));
            _this.cachelen = len;
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], TicketsListComponent.prototype, "mode", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], TicketsListComponent.prototype, "count", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], TicketsListComponent.prototype, "preload", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TicketsListComponent.prototype, "filter", void 0);
    TicketsListComponent = __decorate([
        core_1.Component({
            selector: 'tickets-list',
            templateUrl: 'build/components/tickets-list/tickets-list.html',
            directives: [ionic_angular_1.IONIC_DIRECTIVES],
            pipes: [pipes_1.GravatarPipe, pipes_1.LinebreaksPipe, pipes_1.CapitalizePipe, pipes_1.HtmlsafePipe],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.NavParams, ionic_angular_1.Config, ticket_provider_1.TicketProvider])
    ], TicketsListComponent);
    return TicketsListComponent;
}());
exports.TicketsListComponent = TicketsListComponent;
