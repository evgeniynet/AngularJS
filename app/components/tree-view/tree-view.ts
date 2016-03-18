import {IONIC_DIRECTIVES, NavController, NavParams} from 'ionic-framework/ionic';
import {Component, Input, Output, EventEmitter} from 'angular2/core';

export interface ITreeNode {
id: number;
name: string;
children: Array<ITreeNode>;
isExpanded: boolean;
}

@Component({
selector: "tree-view",
    templateUrl: "build/components/tree-view/tree-view.html",
    directives: [TreeViewComponent, IONIC_DIRECTIVES]
})

export class TreeViewComponent {

@Input() Nodes: Array<ITreeNode>;
@Input() SelectedNode: ITreeNode;

@Output() onSelectedChanged: EventEmitter<ITreeNode> = new EventEmitter();
@Output() onRequestNodes: EventEmitter<ITreeNode> = new EventEmitter();

constructor() { }

onSelectNode(node: ITreeNode) {
this.onSelectedChanged.emit(node);
}

onExpand(node: ITreeNode) {
    if (!node.children)
        return;
    
node.isExpanded = !node.isExpanded;

    if (node.isExpanded && (!node.children || node.children.length == 0)) {
this.onRequestNodes.emit(parent);
}
}
 
 onRequest(parent: ITreeNode) {
     console.log("inner request");
     return;
 }
}