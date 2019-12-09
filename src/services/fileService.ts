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
    this.initFs(false);
  }

  private initFs(wipe: boolean) {
    this.fs = new FS(FileService.FS_NAME, {wipe});
    this.pfs = this.fs.promises;
    // For debugging
    (<any>window).fs = this.fs;
    (<any>window).pfs = this.pfs;
  }

  async wipeFs() {
    this.initFs(true);
    // TODO(fawind): Fix race condition when resetting the FS when cloning a new repo
    return new Promise(resolve => setTimeout(() => resolve(), 1000));
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
    FileService.assertDirectory(dir);
    await this.pfs.rmdir(dir.path);
  }

  async addFile(path: string, content: string) {
    return this.pfs.writeFile(path, content, {encoding: FileService.ENCODING});
  }

  async removeFile(file: FileEntry) {
    FileService.assertFile(file);
    await this.pfs.unlink(file.path);
  }

  async readFile(file: FileEntry): Promise<string> {
    FileService.assertFile(file);
    return this.pfs.readFile(file.path, {encoding: FileService.ENCODING});
  }

  async writeFile(file: FileEntry, content: string): Promise<void> {
    FileService.assertFile(file);
    await this.pfs.writeFile(file.path, content, {encoding: FileService.ENCODING});
  }

  static getRootDir(): FileEntry {
    return FileService.ROOT_DIR;
  }

  getFSInstance(): typeof FS {
    return this.fs;
  }

  static assertDirectory(file: FileEntry) {
    if (!file.isDirectory()) {
      throw new Error(`Entry ${file.path} is not a directory`);
    }
  }

  static assertFile(file: FileEntry) {
    if (!file.isFile()) {
      throw new Error(`Item ${file.path} is not a file`);
    }
  }

  private static joinPath(base: string, file: string): string {
    if (base === '/') {
      return `/${file}`;
    }
    return `${base}/${file}`;
  }

  private async getFileInfo(filePath: string): Promise<FileEntry> {
    const stat = await this.pfs.stat(filePath);
    return new FileEntry(filePath, stat.type === 'file' ? FileType.File : FileType.Directory);
  }
}
