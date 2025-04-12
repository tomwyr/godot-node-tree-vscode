import { close, DataType, define, open } from "ffi-rs";
import * as vscode from "vscode";
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
}: ScanBranchesInput): Result<NodeTree> {
  const result = gbc.generateNodeTre([projectPath]);
  return parseResult(result);
}

export type ScanBranchesInput = {
  projectPath: string;
};

const gbc = define({
  generateNodeTre: {
    library: "godotNodeTreeCore",
    paramsType: [DataType.String],
    retType: DataType.String,
    freeResultMemory: true,
  },
});
