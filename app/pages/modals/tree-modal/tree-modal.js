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
var tree_view_1 = require("../../../components/tree-view/tree-view");
var TreeModal = (function () {
    function TreeModal(params, viewCtrl) {
        this.params = params;
        this.viewCtrl = viewCtrl;
        this.name = this.params.data.name;
        this.Nodes = this.params.data.items;
    }
    TreeModal.prototype.onSelectNode = function (node) {
        this.selectedNode = node;
    };
    TreeModal.prototype.onRequest = function (parent) {
        return;
    };
    TreeModal.prototype.dismiss = function (isCancel) {
        var item = {};
        if (this.selectedNode && !isCancel)
            item = {
                id: this.selectedNode.id,
                name: this.selectedNode.name
            };
        this.viewCtrl.dismiss(item);
    };
    TreeModal = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/modals/tree-modal/tree-modal.html',
            directives: [tree_view_1.TreeViewComponent]
        }),
        __metadata("design:paramtypes", [ionic_angular_1.NavParams,
            ionic_angular_1.ViewController])
    ], TreeModal);
    return TreeModal;
}());
exports.TreeModal = TreeModal;
