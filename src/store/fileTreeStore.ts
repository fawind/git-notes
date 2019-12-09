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
}

export class FileTreeStore {
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
      this._fileTree = FileTreeStore.toFileTree(files);
    });
  }

  @computed
  get fileTree(): FileTreeItem[] {
    return this._fileTree;
  }

  @action.bound
  async toggleDir(item: FileTreeItem) {
    FileService.assertDirectory(item.file);
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
        set(item, {isExpanded: true, children: FileTreeStore.toFileTree(children)});
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
}
