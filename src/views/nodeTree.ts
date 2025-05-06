import path from "path";
import {
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  window,
} from "vscode";
import { loadConfiguration } from "../common/configuration";
import { Node, NodeTree } from "../common/models";
import { getWorkspaceRoot } from "../common/workspace";
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
      this.nodeTree = getNodeTree();
      this.changeEvent.fire();
    });
  }
}

function getNodeTree(): NodeTree | undefined {
  const result = generateNodeTree({ projectPath: getProjectPath() });
  switch (result.type) {
    case "ok":
      return result.value;
    case "err":
      // TODO Display detailed error moessage.
      window.showErrorMessage("An error occured while generating node tree");
      return;
  }
}

function getProjectPath() {
  const workspacePath = getWorkspaceRoot();
  const relativePath = loadConfiguration().projectPath.trim();
  return path.join(workspacePath, relativePath);
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
