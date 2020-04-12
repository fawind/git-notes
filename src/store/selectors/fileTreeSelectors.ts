import { FileEntry, FileTree, FileTreeItem } from "@src/store/types";
import { ROOT_ENTRY } from "@src/store/reducers/fileTreeReducer";

export const getFileTreeRoot = (fileTree: FileTree): FileTreeItem[] => {
  const rootEntry = fileTree[ROOT_ENTRY.path];
  if (!rootEntry || rootEntry.children === null) {
    return [];
  }
  return rootEntry.children.map((child) => fileTree[child]);
};

export const getFileTreeChildren = (fileTree: FileTree, root: FileTreeItem): FileTreeItem[] => {
  const fileTreeItem = fileTree[root.file.path];
  if (!fileTreeItem.isExpanded || fileTreeItem.children === null) {
    return [];
  }
  return fileTreeItem.children.map((childPath: string) => fileTree[childPath]);
};
