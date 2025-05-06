import { workspace } from "vscode";
import { GodotNodeTreeConfig } from "./models";

export function loadConfiguration(): GodotNodeTreeConfig {
  const extConfig = workspace.getConfiguration("godotNodeTree");
  return {
    projectPath: extConfig.get("projectPath", ""),
  };
}
