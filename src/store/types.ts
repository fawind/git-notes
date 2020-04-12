export const enum FileType {
  FILE = "FILE",
  DIRECTORY = "DIRECTORY",
}

export interface FileEntry {
  path: string;
  type: FileType;
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

export interface Settings {
  repo: RepoSettings;
  theme: ThemeSettings;
  appSettings: AppSettings;
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
  showSidebar: boolean;
}
