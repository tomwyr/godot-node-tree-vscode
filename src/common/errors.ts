import { NodeParams } from "./models";

export type GodotNodeTreeError =
  | { type: "invalidGodotProject"; projectPath: string }
  | { type: "scanningScenesFailed"; projectPath: string }
  | { type: "readingSceneFailed"; scenePath: string }
  | { type: "unexpectedNodeParameters"; nodeParams: NodeParams }
  | { type: "unexpectedSceneResource"; instance: string }
  | { type: "parentNodeNotFound"; sceneName: string };

export function getErrorDescription(error: GodotNodeTreeError): string {
  switch (error.type) {
    case "invalidGodotProject":
      return `Godot project could not be found at path \`${error.projectPath}\`.`;
    case "scanningScenesFailed":
      return `Unable to scan scene files for project at \`${error.projectPath}\`.`;
    case "readingSceneFailed":
      return `Unable to read contens of scene at \`${error.scenePath}\`.`;
    case "unexpectedNodeParameters":
      return `A node with unexpected set of parameters encountered: ${error.nodeParams}.`;
    case "unexpectedSceneResource":
      return `A node pointing to an unknown scene resource encountered with id: ${error.instance}.`;
    case "parentNodeNotFound":
      return `None of the parsed nodes was identified as the parent node of scene ${error.sceneName}.`;
  }
}
