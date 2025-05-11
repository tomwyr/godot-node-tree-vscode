import { close, DataType, define, open } from "ffi-rs";
import * as vscode from "vscode";
import { GodotNodeTreeError } from "../common/errors";
import { getLibraryPath } from "../common/library";
import { NodeTree } from "../common/models";
import { parseResult, Result } from "./result";

export function initialize(context: vscode.ExtensionContext) {
  open({
    library: "godotNodeTreeCore",
    path: getLibraryPath(context),
  });
}

export function dispose() {
  close("godotNodeTreeCore");
}

export function generateNodeTree({
  projectPath,
  validateProjectPath,
}: GenerateNodeTreeInput): Result<NodeTree, GodotNodeTreeError> {
  const result = lib.generateNodeTree([projectPath, validateProjectPath]);
  return parseResult(result);
}

export type GenerateNodeTreeInput = {
  projectPath: string;
  validateProjectPath: boolean;
};

const lib = define({
  generateNodeTree: {
    library: "godotNodeTreeCore",
    paramsType: [DataType.String, DataType.Boolean],
    retType: DataType.String,
    freeResultMemory: true,
  },
});
