import * as FS from '@isomorphic-git/lightning-fs';
import {FileEntry, FileType} from '@src/store/types';


export class FileService {
  private static readonly FS_NAME = 'git-fs';

  private static readonly ROOT_PATH = '/';
  private static readonly ROOT_DIR = new FileEntry(FileService.ROOT_PATH, FileType.Directory);
  private static readonly ENCODING = 'utf8';

  private fs: typeof FS;
  private pfs: PromiseFS;

  constructor() {
    this.fs = new FS(FileService.FS_NAME);
    this.pfs = this.fs.promises;
    // For debugging
    (<any>window).fs = this.fs;
    (<any>window).pfs = this.pfs;
  }

  wipeFs() {
    this.fs = new FS(FileService.FS_NAME, {wipe: true});
    this.pfs = this.fs.promises;
  }

  async listRoot(): Promise<FileEntry[]> {
    return this.listDir(FileService.ROOT_DIR);
  }

  async listDir(dir: FileEntry): Promise<FileEntry[]> {
    const files = await this.pfs.readdir(dir.path);
    return Promise.all(files
        .map(f => FileService.joinPath(dir.path, f))
        .map(f => this.getFileInfo(f)));
  }

  async addDir(dirname: string) {
    await this.pfs.mkdir(dirname);
  }

  async removeDir(dir: FileEntry) {
    if (!dir.isDirectory()) {
      throw new Error(`Path ${dir.path} is not a directory`);
    }
    await this.pfs.rmdir(dir.path);
  }

  async addFile(path: string, content: string) {
    return this.pfs.writeFile(path, content, {encoding: FileService.ENCODING});
  }

  async removeFile(file: FileEntry) {
    if (!file.isFile()) {
      throw new Error(`Path ${file.path} is not a file`);
    }
    await this.pfs.unlink(file.path);
  }

  async readFile(file: FileEntry): Promise<string> {
    if (!file.isFile()) {
      throw new Error(`Path ${file.path} is not a file`);
    }
    return this.pfs.readFile(file.path, {encoding: FileService.ENCODING});
  }

  static joinPath(base: string, file: string): string {
    if (base === '/') {
      return `/${file}`;
    }
    return `${base}/${file}`;
  }

  static getRootDir(): FileEntry {
    return FileService.ROOT_DIR;
  }

  getFSInstance(): typeof FS {
    return this.fs;
  }

  private async getFileInfo(filePath: string): Promise<FileEntry> {
    const stat = await this.pfs.stat(filePath);
    return new FileEntry(filePath, stat.type === 'file' ? FileType.File : FileType.Directory);
  }
}
