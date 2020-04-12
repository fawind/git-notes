import * as FS from "@isomorphic-git/lightning-fs";

export class FileSystem {
  private static FS_NAME = "git-notes-fs";
  private static fs = new FS(FileSystem.FS_NAME);
  private static pfs: PromiseFS = FileSystem.fs.promises;

  static get(): PromiseFS {
    return FileSystem.pfs;
  }

  static getBacking(): any {
    return FileSystem.fs;
  }

  static wipe() {
    FileSystem.fs = new FS(FileSystem.FS_NAME, { wipe: true });
    FileSystem.pfs = FileSystem.fs.promises;
  }
}
