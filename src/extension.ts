import { commands, ExtensionContext, window, workspace } from "vscode";
import * as ffi from "./ffi/ffi";
import { NodeTreeView } from "./views/nodeTree";

export function activate(context: ExtensionContext) {
  ffi.initialize(context);

  const nodeTreeView = new NodeTreeView();
  queueMicrotask(() => nodeTreeView.refresh());

  const treeViewDisposer = window.registerTreeDataProvider(
    "nodeTree",
    nodeTreeView
  );

  const refreshCommandSubscription = commands.registerCommand(
    "godot-node-tree-vscode.refreshNodeTree",
    () => nodeTreeView.refresh()
  );

  const configListenerDisposer = workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("godotNodeTree")) {
      nodeTreeView.refresh();
    }
  });

  context.subscriptions.push(
    treeViewDisposer,
    refreshCommandSubscription,
    configListenerDisposer
  );
}

export function deactivate() {}
