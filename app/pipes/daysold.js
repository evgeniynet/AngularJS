"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var DaysoldPipe = (function () {
    function DaysoldPipe() {
    }
    DaysoldPipe.prototype.transform = function (value) {
        value = value || 0;
        if (isNaN(value))
            value = Math.round((Date.now() - +new Date(value)) / 60000);
        var daysOld = value / 60;
        var result = "";
        if (!value || value < 2)
            result = "a minute ago";
        else if (value < 60)
            result = "a " + value + " minutes ago";
        else if (value < 120)
            result = "within hour";
        else if (daysOld > 24) {
            result = parseInt((daysOld / 24).toString()) + " days ago";
        }
        else {
            result = parseInt(daysOld.toString()) + " hours ago";
        }
        return result;
    };
    DaysoldPipe = __decorate([
        core_1.Pipe({
            name: 'Daysold'
        })
    ], DaysoldPipe);
    return DaysoldPipe;
}());
exports.DaysoldPipe = DaysoldPipe;
