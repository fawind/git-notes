import { TypedReducer } from "redoodle";
import { FileEntry, FileTree, FileTreeItem, FileType } from "@src/store/types";
import {
  CollapseFileTreeItem,
  ExpandLoadedFileTreeItem,
  ExpandUnloadedFileTreeItem,
  SetFileTree,
} from "@src/store/actions";

export const ROOT_ENTRY: FileEntry = { path: "/", type: FileType.DIRECTORY };

export const fileTreeReducer = TypedReducer.builder<FileTree>()
  .withHandler(SetFileTree.TYPE, (state, payload) => {
    const fileTree: FileTree = {
      ["/"]: { file: ROOT_ENTRY, isExpanded: true, children: payload.files.map((f) => f.path) },
    };
    payload.files.forEach((file) => (fileTree[file.path] = toFileTreeItem(file)));
    return fileTree;
  })
  .withHandler(CollapseFileTreeItem.TYPE, (state, payload) => {
    if (!state.hasOwnProperty(payload.file.path)) {
      return state;
    }
    const item = state[payload.file.path];
    return { ...state, [payload.file.path]: { ...item, isExpanded: false } };
  })
  .withHandler(ExpandLoadedFileTreeItem.TYPE, (state, payload) => {
    if (!state.hasOwnProperty(payload.file.path)) {
      return state;
    }
    const item = state[payload.file.path];
    return { ...state, [payload.file.path]: { ...item, isExpanded: true } };
  })
  .withHandler(ExpandUnloadedFileTreeItem.TYPE, (state, payload) => {
    if (!state.hasOwnProperty(payload.file.path)) {
      return state;
    }
    const item = state[payload.file.path];
    const childPaths = payload.children.map((file) => file.path);
    payload.children.forEach((file) => (state[file.path] = toFileTreeItem(file)));
    return {
      ...state,
      [payload.file.path]: { ...item, children: childPaths, isExpanded: true },
    };
  })
  .build();

const toFileTreeItem = (file: FileEntry): FileTreeItem => ({
  file,
  children: null,
  isExpanded: false,
});
