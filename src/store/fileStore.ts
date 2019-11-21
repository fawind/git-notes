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

export class OpenFile {
  constructor(readonly file: FileEntry, readonly content: string) {
  }
}

export class FileStore {
  private readonly fileService: FileService;
  private readonly rootDir: FileEntry;
  @observable private _fileTree: FileTreeItem[] = [];
  @observable private _currentFile: OpenFile | null = null;

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

  @computed
  get currentFile(): OpenFile | null {
    return this._currentFile;
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
  async openFile(item: FileTreeItem) {
    FileStore.assertFile(item);
    const content = await this.fileService.readFile(item.file);
    runInAction(() => this._currentFile = new OpenFile(item.file, content));
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
