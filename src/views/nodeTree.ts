import path from "path";
import {
  commands,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  window,
} from "vscode";
import { loadConfiguration } from "../common/configuration";
import { getErrorDescription, GodotNodeTreeError } from "../common/errors";
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
      setDataState("loading");
      this.nodeTree = getNodeTree();
      this.changeEvent.fire();
      setDataState(this.nodeTree ? "data" : "error");
    });
  }
}

function getNodeTree(): NodeTree | undefined {
  const result = generateNodeTree({
    projectPath: getProjectPath(),
    validateProjectPath: true,
  });
  switch (result.type) {
    case "ok":
      return result.value;
    case "err":
      handleNodeTreeError(result.value);
      return;
  }
}

async function handleNodeTreeError(error: GodotNodeTreeError) {
  const message = getErrorDescription(error);

  switch (error.errorType) {
    case "invalidGodotProject":
      showError(message, {
        "Configure path": () =>
          commands.executeCommand(
            "workbench.action.openSettings",
            "godotNodeTree.projectPath"
          ),
      });
      break;

    default:
      showError(message);
      break;
  }
}

async function showError<T extends string>(
  message: T,
  actions: { [key: string]: () => void } = {}
) {
  const items = Object.keys(actions);
  const selectedItem = await window.showErrorMessage(message, ...items);
  if (selectedItem) {
    actions[selectedItem]();
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

function setDataState(value: "loading" | "data" | "error") {
  commands.executeCommand(
    "setContext",
    "godot-node-tree-vscode.dataState",
    value
  );
}
