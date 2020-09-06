import { TypedAction } from "redoodle";
import { FileEntry } from "@src/store/types";

export const OpenFile = TypedAction.define("@git-notes/OPEN_FILE")<{
  file: FileEntry;
  content: string;
}>();

export const CloseFile = TypedAction.define("@git-notes/CLOSE_FILE")();

export const SetFileTree = TypedAction.define("@git-notes/SET_FILE_TREE")<{
  files: FileEntry[];
}>();

export const CollapseFileTreeItem = TypedAction.define("@git-notes/COLLAPSE_FILE_TREE_ITEM")<{
  file: FileEntry;
}>();

export const ExpandLoadedFileTreeItem = TypedAction.define(
  "@git-notes/EXPAND_LOADED_FILE_TREE_ITEM"
)<{
  file: FileEntry;
}>();

export const ExpandUnloadedFileTreeItem = TypedAction.define(
  "@git-notes/EXPAND_UNLOADED_FILE_TREE_ITEM"
)<{
  file: FileEntry;
  children: FileEntry[];
}>();

export const SetCloneSettings = TypedAction.define("@git-notes/SET_CLONE_SETTINGS")<{
  url: string;
  user: string | null;
  email: string | null;
  token: string | null;
}>();

export const LoadSettings = TypedAction.define("@git-notes/LOAD_SETTINGS")();

export const ToggleFileSearch = TypedAction.define("@git-notes/TOGGLE_FILE_SEARCH")();

export const ToggleFileTree = TypedAction.define("@git-notes/TOGGLE_FILE_TREE")();
