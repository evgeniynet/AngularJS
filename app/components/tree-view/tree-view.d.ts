import { EventEmitter } from '@angular/core';
export interface ITreeNode {
    id: number;
    name: string;
    sub: Array<ITreeNode>;
    isExpanded: boolean;
    is_active: boolean;
    is_restrict_to_techs: boolean;
    parent: string;
}
export declare class TreeViewComponent {
    Nodes: Array<ITreeNode>;
    SelectedNode: ITreeNode;
    onSelectedChanged: EventEmitter<any>;
    constructor();
    onSelectNode(node: ITreeNode): void;
    onExpand(node: ITreeNode): void;
    onRequest(parent: ITreeNode): void;
}
