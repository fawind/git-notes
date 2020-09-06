import { FileEntry, FileType } from "@src/store/types";
import { FileSystem } from "@src/services/fileSystem";

export class FileService {
  private static readonly ROOT_PATH = "/";
  private static readonly ROOT_DIR = {
    path: FileService.ROOT_PATH,
    type: FileType.DIRECTORY,
  };
  private static readonly ENCODING = "utf8";

  static async wipeFs() {
    FileSystem.wipe();
    // TODO(fawind): Fix race condition when resetting the FS when cloning a new repo
    return new Promise((resolve) => setTimeout(() => resolve(), 1000));
  }

  static async listRoot(): Promise<FileEntry[]> {
    return FileService.listDir(FileService.ROOT_DIR);
  }

  static async listDir(dir: FileEntry): Promise<FileEntry[]> {
    const files = await FileSystem.get().readdir(dir.path);
    return Promise.all(
      files.map((f) => FileService.joinPath(dir.path, f)).map((f) => FileService.getFileInfo(f))
    );
  }

  static async addDir(dirname: string) {
    await FileSystem.get().mkdir(dirname);
  }

  static async removeDir(dir: FileEntry) {
    FileService.assertDirectory(dir);
    await FileSystem.get().rmdir(dir.path);
  }

  static async addFile(path: string, content: string) {
    return FileSystem.get().writeFile(path, content, {
      encoding: FileService.ENCODING,
    });
  }

  static async removeFile(file: FileEntry) {
    FileService.assertFile(file);
    await FileSystem.get().unlink(file.path);
  }

  static async readFile(file: FileEntry): Promise<string> {
    FileService.assertFile(file);
    return FileSystem.get().readFile(file.path, {
      encoding: FileService.ENCODING,
    });
  }

  static async writeFile(file: FileEntry, content: string): Promise<void> {
    FileService.assertFile(file);
    await FileSystem.get().writeFile(file.path, content, {
      encoding: FileService.ENCODING,
    });
  }

  static async moveFile(file: FileEntry, newPath: string): Promise<void> {
    await FileSystem.get().rename(file.path, newPath);
  }

  static getRootDir(): FileEntry {
    return FileService.ROOT_DIR;
  }

  static assertDirectory(file: FileEntry) {
    if (file.type !== FileType.DIRECTORY) {
      throw new Error(`Entry ${file.path} is not a directory`);
    }
  }

  static assertFile(file: FileEntry) {
    if (file.type !== FileType.FILE) {
      throw new Error(`Item ${file.path} is not a file`);
    }
  }

  private static joinPath(base: string, file: string): string {
    if (base === "/") {
      return `/${file}`;
    }
    return `${base}/${file}`;
  }

  private static async getFileInfo(path: string): Promise<FileEntry> {
    const stat = await FileSystem.get().stat(path);
    return {
      path,
      type: stat.type === "file" ? FileType.FILE : FileType.DIRECTORY,
    };
  }
}

export class FilePathUtils {
  static getFileName(path: string): string {
    const parts = path.split("/");
    return parts[parts.length - 1];
  }

  static getParentDir(path: string): string {
    const parts = path.split("/");
    if (parts.length <= 1) {
      return "/";
    }
    parts.pop();
    return parts.join("/");
  }
}
