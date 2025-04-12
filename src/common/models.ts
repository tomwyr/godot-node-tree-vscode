export type GodotNodeTreeConfig = {
  projectPath?: string;
};

export type NodeTree = {
  scenes: [Scene];
};

export type Scene = {
  name: string;
  root: Node;
};

export type Node = ParentNode | LeafNode | NestedScene;

export type ParentNode = {
  nodeType: "parentNode";
  name: string;
  type: string;
  children: [Node];
};

export type LeafNode = {
  nodeType: "leafNode";
  name: string;
  type: string;
};

export type NestedScene = {
  nodeType: "nestedScene";
  name: string;
  scene: string;
};
