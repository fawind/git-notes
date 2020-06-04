declare module "@isomorphic-git/lightning-fs";

interface Stat {
  type: "file" | "dir";
  mode: string;
  size: number;
  ino: number;
  mtimeMs: number;
  ctimeMs: number;
  uid: 1 | 0;
  gid: 1 | 0;
  dev: 1 | 0;
  isFile: () => boolean;
  isDirectory: () => boolean;
  isSymbolicLink: () => boolean;
}

type FileEncoding = "utf8";

declare interface PromiseFS {
  mkdir: (filepath: string, options?: { mode?: string }) => Promise<void>;
  rmdir: (filepath: string) => Promise<void>;
  readdir: (filepath: string) => Promise<string[]>;
  writeFile: (
    filepath: string,
    data: string,
    options?: { mode?: string; encoding?: FileEncoding }
  ) => Promise<void>;
  readFile: (filepath: string, options?: { encoding?: FileEncoding }) => Promise<string>;
  unlink: (filepath: string) => Promise<void>;
  rename: (oldFilepath: string, newFilepath: string) => Promise<void>;
  stat: (filepath: string) => Promise<Stat>;
  lstat: (filepath: string) => Promise<Stat>;
  symlink: (target: string, filepath: string) => Promise<void>;
  readlink: (filepath: string) => Promise<any>;
  backFile: (filepath: string) => Promise<any>;
}
