export const enum FileType {
  FILE = "FILE",
  DIRECTORY = "DIRECTORY",
}

export interface FileEntry {
  path: string;
  type: FileType;
  secret?: string;
}

export interface CurrentFile {
  file: FileEntry;
  content: string;
}

export interface FileTree {
  [path: string]: FileTreeItem;
}

export interface FileTreeItem {
  file: FileEntry;
  children: string[] | null;
  isExpanded: boolean;
}

export interface GUIState {
  fileSearchVisible: boolean;
}

export interface Settings {
  repo: RepoSettings;
  theme: ThemeSettings;
  appSettings: AppSettings;
  keyBindings: KeyBindingsSettings;
}

export interface RepoSettings {
  url: string | null;
  user: string | null;
  token: string | null;
  email: string | null;
  corsProxy: string | null;
  branch: string;
  defaultCommitMessage: string;
}

export interface ThemeSettings {
  bg: string;
  bgLight: string;
  fg: string;
  fgLight: string;
  primary: string;
  link: string;
}

export interface AppSettings {
  showHiddenFiles: boolean;
  showFileTree: boolean;
}

export interface KeyBindingsSettings {
  toggleFileTree: Hotkey;
  toggleFileSearch: Hotkey;
}

export interface Hotkey {
  key: HotkeyAction;
  shortcut: string;
}

export enum HotkeyAction {
  TOGGLE_FILE_TREE = "TOGGLE_SIDEBAR",
  TOGGLE_FILE_SEARCH = "TOGGLE_FILE_SEARCH",
}

export type FuzzyPrepared = any;
export type HtmlString = string;

export interface FileSearchTarget {
  file: FileEntry;
  preparedTarget: FuzzyPrepared;
}

export interface FileSearchResult {
  file: FileEntry;
  title: HtmlString;
}
