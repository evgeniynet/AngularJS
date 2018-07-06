"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var md5Hex = require('md5-hex');
var GravatarPipe = (function () {
    function GravatarPipe() {
    }
    GravatarPipe.prototype.transform = function (value, args) {
        var hash = "";
        if (value) {
            hash = md5Hex(value);
        }
        else
            return "img/def_ava.png";
        return "https://secure.gravatar.com/avatar/" + hash + "?s=80&d=mm";
    };
    GravatarPipe = __decorate([
        core_1.Pipe({
            name: 'Gravatar'
        })
    ], GravatarPipe);
    return GravatarPipe;
}());
exports.GravatarPipe = GravatarPipe;
