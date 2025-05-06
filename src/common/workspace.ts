import * as vscode from "vscode";

export function getWorkspaceRoot(): string {
  const folders = vscode.workspace.workspaceFolders ?? [];
  if (folders.length === 0) {
    throw noWorkspaceError;
  } else if (folders.length > 1) {
    throw multipleWorkspacesError;
  }

  const uri = folders[0].uri;
  if (uri.scheme !== "file") {
    throw invalidWorkspaceError;
  }
  return uri.path;
}

const noWorkspaceError = new Error(
  "No workspace folder found. Open a Godot project to use the extension."
);
const multipleWorkspacesError = new Error(
  "Multiple workspace folders found. Open a single Godot project to use the extension."
);
const invalidWorkspaceError = new Error(
  "Unsupported folder scheme. Open a local Godot project to use the extension."
);
