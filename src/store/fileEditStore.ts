import {action, computed, observable, runInAction} from 'mobx';
import {FileEntry} from '@src/store/types';
import {FileService} from '@src/services/fileService';
import {GitService} from '@src/services/gitService';
import {inject, injectable} from 'inversify';
import {FileStatusStore} from '@src/store/fileStatusStore';

export class OpenFile {
  constructor(readonly file: FileEntry, readonly content: string) {
  }
}

@injectable()
export class FileEditStore {
  private static WRITE_TIMEOUT: number = 400;
  private readonly fileService: FileService;
  private readonly gitService: GitService;
  private readonly fileStatusStore: FileStatusStore;
  @observable private _currentFile: OpenFile | null = null;
  @observable private _saveTimeout: number = -1;

  constructor(
    @inject(FileService) fileService: FileService,
    @inject(GitService) gitService: GitService,
    @inject(FileStatusStore) fileStatusStore: FileStatusStore) {
    this.fileService = fileService;
    this.gitService = gitService;
    this.fileStatusStore = fileStatusStore;
  }

  @computed
  get currentFile(): OpenFile | null {
    return this._currentFile;
  }

  @action.bound
  async openFile(file: FileEntry) {
    FileService.assertFile(file);
    const content = await this.fileService.readFile(file);
    console.log('Open file', file);
    runInAction(() => this._currentFile = new OpenFile(file, content));
  }

  @action.bound
  async pushFile() {
    this.assertCurrentFile();
    await this.gitService.pushFile(this._currentFile!.file);
  }

  @action.bound
  async revertFile() {
    this.assertCurrentFile();
    await this.gitService.checkoutFile(this._currentFile!.file);
  }

  @action.bound
  async pullFiles() {
    await this.gitService.pull();
  }

  @action.bound
  onChange(file: FileEntry, getContent: () => string) {
    if (this._saveTimeout !== -1) {
      window.clearTimeout(this._saveTimeout);
    }
    this._saveTimeout = window.setTimeout(() => {
      const content = getContent();
      if (this._currentFile && this._currentFile.content !== content) {
        this.fileService.writeFile(file, content);
        console.log('Content saved to FS', file);
        this.fileStatusStore.updateModifiedFiles();
      }
    }, FileEditStore.WRITE_TIMEOUT);
  }

  private assertCurrentFile() {
    if (!this._currentFile) {
      throw new Error('No current file selected');
    }
  }
}
