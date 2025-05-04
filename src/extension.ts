import { commands, ExtensionContext, window } from "vscode";
import * as ffi from "./ffi/ffi";
import { NodeTreeView } from "./views/nodeTree";

export function activate(context: ExtensionContext) {
  ffi.initialize(context);
  const nodeTreeView = new NodeTreeView();
  window.registerTreeDataProvider("nodeTree", nodeTreeView);
  const subscription = commands.registerCommand(
    "godot-node-tree-vscode.refreshNodeTree",
    () => nodeTreeView.refresh()
  );
  context.subscriptions.push(subscription);
}

export function deactivate() {}
