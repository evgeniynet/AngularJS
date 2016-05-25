import {Nav, NavParams, Page, Events, ViewController} from 'ionic-angular';
//import {Input} from '@angular/core';
import {Component, OnInit} from '@angular/core';
//import {NgClass} from '@angular/common';
import {TreeViewComponent, ITreeNode} from '../../../components/tree-view/tree-view';

@Page({
    templateUrl: 'build/pages/modals/tree-modal/tree-modal.html',
    directives: [TreeViewComponent]
})
export class TreeModal {

    Nodes: Array<ITreeNode>;
    selectedNode: ITreeNode;
    name: string;

    constructor(
    private params: NavParams,
     private viewCtrl: ViewController
    ) {
        this.name = this.params.data.name;
        this.Nodes = this.params.data.items;
    }
    
    // обработка события смены выбранного узла
    onSelectNode(node: ITreeNode) {
        this.selectedNode = node;
        //console.log(node);
    }
// обработка события вложенных узлов
onRequest(parent: ITreeNode) {
    return;
    //this.treeService.GetNodes(parent.id).subscribe( res => parent.sub = res, error=> console.log(error));
}


    dismiss(isCancel) {
        //let data = { 'foo': 'bar' };
        let item = {};
        if (this.selectedNode && !isCancel)
            item = {
                id: this.selectedNode.id,
                name: this.selectedNode.name
            };
        this.viewCtrl.dismiss(item);
    }
}