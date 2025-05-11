import { NodeParams } from "./models";

export type GodotNodeTreeError =
  | { errorType: "invalidGodotProject"; projectPath: string }
  | { errorType: "scanningScenesFailed"; projectPath: string }
  | { errorType: "readingSceneFailed"; scenePath: string }
  | { errorType: "unexpectedNodeParameters"; nodeParams: NodeParams }
  | { errorType: "unexpectedSceneResource"; instance: string }
  | { errorType: "parentNodeNotFound"; sceneName: string };

export function getErrorDescription(error: GodotNodeTreeError): string {
  switch (error.errorType) {
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
