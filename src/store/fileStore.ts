import {action, computed, observable, runInAction, set} from 'mobx';
import {FileEntry} from '@src/store/types';
import {FileService} from '@src/services/fileService';

export class FileTreeItem {
  readonly file: FileEntry;
  readonly canExpand: boolean;
  @observable children: FileTreeItem[] | null = null;
  @observable isExpanded: boolean = false;

  constructor(file: FileEntry) {
    this.file = file;
    this.canExpand = file.isDirectory();
  }

  @computed get name(): string {
    const parts = this.file.path.split('/');
    const name = parts.length <= 1 ? this.file.path : parts[parts.length - 1];
    return this.file.isFile() ? name : name + '/';
  }
}

export class FileStore {
  private readonly fileService: FileService;
  private readonly rootDir: FileEntry;
  @observable private _fileTree: FileTreeItem[] = [];

  constructor(fileService: FileService) {
    this.fileService = fileService;
    this.rootDir = FileService.getRootDir();
  }

  @action.bound
  async init() {
    const files: FileEntry[] = await this.fileService.listRoot();
    runInAction(() => {
      this._fileTree = FileStore.toFileTree(files);
    });
  }

  @computed
  get fileTree(): FileTreeItem[] {
    return this._fileTree;
  }

  @action.bound
  async toggleDir(item: FileTreeItem) {
    FileStore.assertDirectory(item);
    if (item.isExpanded) {
      this.collapseDir(item);
    } else {
      await this.expandDir(item);
    }
  }

  @action.bound
  private async expandDir(item: FileTreeItem) {
    if (item.children !== null) {
      runInAction(() => set(item, {isExpanded: true}));
    } else {
      const children = await this.fileService.listDir(item.file);
      runInAction(() => {
        set(item, {isExpanded: true, children: FileStore.toFileTree(children)});
      });
    }
  }

  @action.bound
  private collapseDir(item: FileTreeItem) {
    set(item, {isExpanded: false});
  }

  private static toFileTree(files: FileEntry[]): FileTreeItem[] {
    return files.map(file => new FileTreeItem(file));
  }

  private static assertDirectory(item: FileTreeItem) {
    if (!item.file.isDirectory()) {
      throw new Error(`Entry ${item.file.path} is not a directory`);
    }
  }

  private static assertFile(item: FileTreeItem) {
    if (!item.file.isFile()) {
      throw new Error(`Item ${item.file.path} is not a file`);
    }
  }
}
