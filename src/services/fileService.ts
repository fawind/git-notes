import * as FS from '@isomorphic-git/lightning-fs';
import * as git from 'isomorphic-git';
import {FileEntry, FileType} from '@src/store/types';


export class FileService {
  private static readonly FS_NAME = 'git-fs';
  private static readonly GIT_FS_KEY = 'fs';
  private static readonly ROOT_DIR: FileEntry = new FileEntry('/', FileType.Directory);
  private static readonly ENCODING = 'utf8';

  private readonly fs: any;
  private readonly pfs: PromiseFS;

  constructor(fsName: string = FileService.FS_NAME) {
    this.fs = new FS(fsName);
    this.pfs = this.fs.promises;
    git.plugins.set(FileService.GIT_FS_KEY, this.fs);
  }

  async listRoot(): Promise<FileEntry[]> {
    return this.listDir(FileService.ROOT_DIR);
  }

  async listDir(dir: FileEntry): Promise<FileEntry[]> {
    const files = await this.pfs.readdir(dir.path);
    return Promise.all(files.map(f => this.getFileInfo(f)));
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

  async readFile(file: FileEntry): Promise<String> {
    if (!file.isFile()) {
      throw new Error(`Path ${file.path} is not a file`);
    }
    return this.pfs.readFile(file.path, {encoding: FileService.ENCODING});
  }

  private async getFileInfo(filePath: string): Promise<FileEntry> {
    const stat = await this.pfs.stat(`/${filePath}`);
    return new FileEntry(filePath, stat.type === 'file' ? FileType.File : FileType.Directory);
  }
}