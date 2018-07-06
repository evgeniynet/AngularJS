"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var MorePipe = (function () {
    function MorePipe() {
    }
    MorePipe.prototype.transform = function (value, args) {
        args = args || [100, "VV"];
        value = value || 0;
        var max = args[0];
        var template = args[1] || "VV";
        if (max == 999 && value > max) {
            value = "99<sup>+</sup>";
        }
        else if (value >= max) {
            value = (max - 1) + "<sup>+</sup>";
        }
        else {
            var s_value = value.toString();
            if (~template.indexOf("$") || ~s_value.indexOf("."))
                value = value.toFixed(value > 99 && ~s_value.indexOf(".00") ? 0 : 2);
        }
        if (~template.indexOf("$"))
            template = template.replace("$", localStorage.getItem("currency"));
        value = template.replace("VV", value);
        return value;
    };
    MorePipe = __decorate([
        core_1.Pipe({
            name: 'More'
        })
    ], MorePipe);
    return MorePipe;
}());
exports.MorePipe = MorePipe;
