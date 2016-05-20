import {IONIC_DIRECTIVES, NavController, NavParams} from 'ionic-angular';
import {Component, Input, Output, EventEmitter} from '@angular/core';

export interface ITreeNode {
id: number;
name: string;
sub: Array<ITreeNode>;
isExpanded: boolean;
    is_active: boolean;
    is_restrict_to_techs: boolean;
    parent: string;
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
//@Output() onRequestNodes: EventEmitter<ITreeNode> = new EventEmitter();

constructor() { }

onSelectNode(node: ITreeNode) {
this.onSelectedChanged.emit(node);
}

onExpand(node: ITreeNode) {
    if (!node.sub)
        return;
    
node.isExpanded = !node.isExpanded;

   // if (node.isExpanded && (!node.sub || node.sub.length == 0)) {
//this.onRequestNodes.emit(parent);
//}
}
 
 onRequest(parent: ITreeNode) {
     console.log("inner request");
     return;
 }
}