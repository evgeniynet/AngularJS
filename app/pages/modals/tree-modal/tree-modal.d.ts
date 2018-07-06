import { NavParams, ViewController } from 'ionic-angular';
import { ITreeNode } from '../../../components/tree-view/tree-view';
export declare class TreeModal {
    private params;
    private viewCtrl;
    Nodes: Array<ITreeNode>;
    selectedNode: ITreeNode;
    name: string;
    constructor(params: NavParams, viewCtrl: ViewController);
    onSelectNode(node: ITreeNode): void;
    onRequest(parent: ITreeNode): void;
    dismiss(isCancel: any): void;
}
