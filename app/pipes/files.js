"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var helpers_1 = require("../directives/helpers");
var FilesPipe = (function () {
    function FilesPipe() {
    }
    FilesPipe.prototype.transform = function (value, args) {
        var isPhonegap = localStorage.getItem("isPhonegap") === "true";
        value = value || "";
        var files = args || [];
        if (!value || !files || files.length == 0 ||
            !(~value.indexOf("cid:") || ~value.indexOf("ollowing file")))
            return value;
        files.sort(function (a, b) {
            return b.name.length - a.name.length;
        });
        value = helpers_1.FileUrlHelper.addUrls(value, files);
        return value;
    };
    FilesPipe = __decorate([
        core_1.Pipe({
            name: 'Files'
        })
    ], FilesPipe);
    return FilesPipe;
}());
exports.FilesPipe = FilesPipe;
