import * as FS from '@isomorphic-git/lightning-fs';
import * as git from 'isomorphic-git';

export enum FileType {
  File = 0,
  Directory = 1,
}

export class File {
  public readonly path: string;
  public readonly name: string;
  public readonly type: FileType;

  constructor(path: string, type: FileType) {
    this.path = path;
    this.type = type;
    this.name = File.getFilename(path);
  }

  isFile(): boolean {
    return this.type === FileType.File;
  }

  isDirectory(): boolean {
    return this.type === FileType.Directory;
  }

  private static getFilename(filePath: string) {
    const parts = filePath.split('/');
    if (parts.length <= 1) {
      return filePath;
    }
    return parts[parts.length - 1];
  }
}

export class FileService {
  private static readonly FS_NAME = 'git-fs';
  private static readonly GIT_FS_KEY = 'fs';
  private static readonly ROOT_DIR: File = new File('/', FileType.Directory);
  private static readonly ENCODING = 'utf8';

  private readonly fs: any;
  private readonly pfs: PromiseFS;

  constructor(fsName: string = FileService.FS_NAME) {
    this.fs = new FS(fsName);
    this.pfs = this.fs.promises;
    git.plugins.set(FileService.GIT_FS_KEY, this.fs);
  }

  async listRoot(): Promise<File[]> {
    return this.listDir(FileService.ROOT_DIR);
  }

  async listDir(dir: File): Promise<File[]> {
    const files = await this.pfs.readdir(dir.path);
    return Promise.all(files.map(f => this.getFileInfo(f)));
  }

  async addDir(dirname: string) {
    await this.pfs.mkdir(dirname);
  }

  async removeDir(dir: File) {
    if (!dir.isDirectory()) {
      throw new Error(`Path ${dir.path} is not a directory`);
    }
    await this.pfs.rmdir(dir.path);
  }

  async addFile(path: string, content: string) {
    return this.pfs.writeFile(path, content, {encoding: FileService.ENCODING});
  }

  async removeFile(file: File) {
    if (!file.isFile()) {
      throw new Error(`Path ${file.path} is not a file`);
    }
    await this.pfs.unlink(file.path);
  }

  async readFile(file: File): Promise<String> {
    if (!file.isFile()) {
      throw new Error(`Path ${file.path} is not a file`);
    }
    return this.pfs.readFile(file.path, {encoding: FileService.ENCODING});
  }

  private async getFileInfo(filePath: string): Promise<File> {
    const stat = await this.pfs.stat(`/${filePath}`);
    return new File(filePath, stat.type === 'file' ? FileType.File : FileType.Directory);
  }
}
