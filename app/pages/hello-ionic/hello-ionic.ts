import {Page, NavController} from 'ionic-framework/ionic';
import {Component, OnInit} from 'angular2/core';
//import {NgClass} from 'angular2/common';
import {TreeViewComponent, ITreeNode} from '../../components/tree-view/tree-view';

@Page({
  templateUrl: 'build/pages/hello-ionic/hello-ionic.html',
  directives: [TreeViewComponent]
})
export class HelloIonicPage {
    
    Nodes: Array<ITreeNode>;
    selectedNode: ITreeNode; // нужен для отображения детальной информации по выбранному узлу.

  constructor(nav: NavController) {
    this.nav = nav;
      this.Nodes = [
          {
              id: 0
              name: 'Root1',
              children: [
                  {
                      name: 'Child1',
                      id: 4,
              children: [
              {
              name: 'Child111',
              id: 41
          }, {
              name: 'Child211',
              id: 51,
          }
      ]
                  }, {
                      name: 'Child2',
                      id: 5,
                  }
              ]
          },
              {
              id: 1
              name: 'Root2',
              children: [
                  {
                      name: 'Child21',
                      id: 4
                  }, {
                      name: 'Child22',
                      id: 5,
                  }
              ]
          }
      ];
  }

// обработка события смены выбранного узла
onSelectNode(node: ITreeNode) {
    this.selectedNode = node;
    console.log(node);
}
// обработка события вложенных узлов
onRequest(parent: ITreeNode) {
    return;
    this.treeService.GetNodes(parent.id).subscribe(
        res => parent.children = res,
        error=> console.log(error));
}

}


