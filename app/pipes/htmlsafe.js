"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var HtmlsafePipe = (function () {
    function HtmlsafePipe() {
    }
    HtmlsafePipe.prototype.transform = function (value, args) {
        value = (value || "").trim();
        if (value.length) {
            var element = document.createElement('div');
            var entity = /&(?:#x[a-f0-9]+|#[0-9]+|[a-z0-9]+);?/ig;
            value = value.replace(entity, function (m) {
                element.innerHTML = m;
                return element.textContent;
            });
            element.textContent = '';
        }
        return value;
    };
    HtmlsafePipe = __decorate([
        core_1.Pipe({
            name: 'Htmlsafe'
        })
    ], HtmlsafePipe);
    return HtmlsafePipe;
}());
exports.HtmlsafePipe = HtmlsafePipe;
