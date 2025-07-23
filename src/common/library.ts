import path from "path";
import * as vscode from "vscode";

export function getLibraryPath(context: vscode.ExtensionContext): string {
  const root = context.extensionPath;
  const fileName = "godotNodeTreeCore" + getLibExtension();
  return path.join(root, "out", fileName);
}

function getLibExtension(): string {
  switch (process.platform) {
    case "win32":
      return ".dll";
    case "linux":
      return ".so";
    case "darwin":
      return ".dylib";
    default:
      throw unsupportedOsError;
  }
}

const unsupportedOsError = new Error(
  "Unsupported operating system. This extension supports only Windows, Linux, or macOS."
);
