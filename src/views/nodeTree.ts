import {
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  window,
} from "vscode";
import { Node, NodeTree } from "../common/models";
import { generateNodeTree } from "../ffi/ffi";

export class NodeTreeView implements TreeDataProvider<Node> {
  private changeEvent = new EventEmitter<void>();
  private nodeTree?: NodeTree;

  onDidChangeTreeData = this.changeEvent.event;

  getTreeItem(node: Node): TreeItem {
    const collapsibleState = hasChildren(node)
      ? TreeItemCollapsibleState.Collapsed
      : TreeItemCollapsibleState.None;
    return new TreeItem(labelOf(node), collapsibleState);
  }

  getChildren(node?: Node): Node[] {
    if (node) {
      return childrenOf(node);
    } else if (this.nodeTree) {
      return this.nodeTree.scenes.map((scene) => scene.root);
    } else {
      return [];
    }
  }

  refresh() {
    window.withProgress({ location: { viewId: "nodeTree" } }, async () => {
      const nodeTree = getNodeTree();
      if (nodeTree) {
        this.nodeTree = nodeTree;
        this.changeEvent.fire();
      }
    });
  }
}

function getNodeTree(): NodeTree | undefined {
  // TODO Provide project path to the generator.
  const result = generateNodeTree({
    projectPath: "",
  });
  switch (result.type) {
    case "ok":
      return result.value;
    case "err":
      // TODO Display detailed error moessage.
      window.showErrorMessage("An error occured while generating node tree");
      return;
  }
}

function hasChildren(node: Node): boolean {
  return childrenOf(node).length > 0;
}

function childrenOf(node: Node): Node[] {
  switch (node.nodeType) {
    case "parentNode":
      return node.children;
    case "leafNode":
    case "nestedScene":
      return [];
    default:
      node satisfies never;
      return [];
  }
}

function labelOf(node: Node): string {
  switch (node.nodeType) {
    case "parentNode":
      return `${node.name} <${node.type}>`;
    case "leafNode":
      return `${node.name} <${node.type}>`;
    case "nestedScene":
      return `${node.name} <${node.scene}>`;
    default:
      node satisfies never;
      return "";
  }
}
