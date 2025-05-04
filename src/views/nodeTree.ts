import { EventEmitter, TreeDataProvider, TreeItem, window } from "vscode";
import { NodeTree } from "../common/models";
import { generateNodeTree } from "../ffi/ffi";

export class NodeTreeView implements TreeDataProvider<TreeItem> {
  private changeEvent = new EventEmitter<void>();
  private loading = false;
  private nodeTree?: NodeTree;

  onDidChangeTreeData = this.changeEvent.event;

  getTreeItem(element: TreeItem): TreeItem {
    return element;
  }

  getChildren(): TreeItem[] {
    if (this.nodeTree) {
      return [];
    }

    if (this.loading) {
      return [new TreeItem("Loading...")];
    }

    return [];
  }

  refresh() {
    if (this.loading) {
      return;
    }

    showProgress(async () => {
      // TODO Provide project path to the generator.
      const result = generateNodeTree({ projectPath: "" });
      if (result.type === "err") {
        // TODO Display detailed error moessage.
        showError("An error occured while generating node tree");
      } else {
        this.nodeTree = result.value;
        this.changeEvent.fire();
      }
    });
  }
}

const showProgress = (callback: () => Thenable<void>) => {
  window.withProgress({ location: { viewId: "nodeTree" } }, callback);
};

const showError = (message: string) => {
  window.showErrorMessage(message);
};
