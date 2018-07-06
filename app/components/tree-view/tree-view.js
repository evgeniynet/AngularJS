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
var TreeViewComponent = (function () {
    function TreeViewComponent() {
        this.onSelectedChanged = new core_1.EventEmitter();
    }
    TreeViewComponent_1 = TreeViewComponent;
    TreeViewComponent.prototype.onSelectNode = function (node) {
        this.onSelectedChanged.emit(node);
    };
    TreeViewComponent.prototype.onExpand = function (node) {
        if (!node.sub)
            return;
        node.isExpanded = !node.isExpanded;
    };
    TreeViewComponent.prototype.onRequest = function (parent) {
        console.log("inner request");
        return;
    };
    var TreeViewComponent_1;
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], TreeViewComponent.prototype, "Nodes", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], TreeViewComponent.prototype, "SelectedNode", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], TreeViewComponent.prototype, "onSelectedChanged", void 0);
    TreeViewComponent = TreeViewComponent_1 = __decorate([
        core_1.Component({
            selector: "tree-view",
            templateUrl: "build/components/tree-view/tree-view.html",
            directives: [TreeViewComponent_1, ionic_angular_1.IONIC_DIRECTIVES]
        }),
        __metadata("design:paramtypes", [])
    ], TreeViewComponent);
    return TreeViewComponent;
}());
exports.TreeViewComponent = TreeViewComponent;
