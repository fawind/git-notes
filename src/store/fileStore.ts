import {action, computed, observable, runInAction} from 'mobx';
import {FileEntry} from '@src/store/types';
import {FileService} from '@src/services/fileService';

export class FileStore {
  private readonly fileService: FileService;
  private readonly rootDir: FileEntry;
  @observable private fileTree: { [path: string]: FileEntry[] } = {};

  constructor(fileService: FileService) {
    this.fileService = fileService;
    this.rootDir = FileService.getRootDir();
    this.fileTree[this.rootDir.path] = [];
  }

  @action.bound
  async init() {
    const files = await this.fileService.listRoot();
    runInAction(() => this.fileTree[this.rootDir.path] = files);
  }

  @computed
  get rootFiles(): FileEntry[] {
    return this.fileTree[this.rootDir.path];
  }

  @action.bound
  async expandDir(dir: FileEntry) {
    FileStore.assertDirectory(dir);
    const files = await this.fileService.listDir(dir);
    runInAction(() => this.fileTree[dir.path] = files);
  }

  private static assertDirectory(file: FileEntry) {
    if (!file.isDirectory()) {
      throw new Error(`File ${file.path} is not a directory`);
    }
  }

  private static assertFile(file: FileEntry) {
    if (!file.isFile()) {
      throw new Error(`File ${file.path} is not a file`);
    }
  }
}
