import {action, computed, observable, runInAction} from 'mobx';
import {FileEntry} from '@src/store/types';
import {FileService} from '@src/services/fileService';
import {GitService} from '@src/services/gitService';

export class FileEditStore {
  private static WRITE_TIMEOUT: number = 400;
  private readonly fileService: FileService;
  private readonly gitService: GitService;
  @observable private _file: FileEntry | null = null;
  @observable content: string = '';
  @observable private _saveTimeout: number = -1;

  constructor(fileService: FileService, gitService: GitService) {
    this.fileService = fileService;
    this.gitService = gitService;
  }

  @computed
  get file(): FileEntry | null {
    return this._file;
  }

  @action.bound
  async openFile(file: FileEntry) {
    FileService.assertFile(file);
    const content = await this.fileService.readFile(file);
    console.log('Open file', file);
    runInAction(() => {
      this._file = file;
      this.content = content;
    });
  }

  @action.bound
  onChange(content: string) {
    if (!this._file) {
      throw new Error('Cannot write file, no file open');
    }
    this.content = content;
    if (this._saveTimeout !== -1) {
      window.clearTimeout(this._saveTimeout);
    }
    this._saveTimeout = window.setTimeout(() => {
      this.fileService.writeFile(this._file!, content);
      console.log('Content saved to FS');
    }, FileEditStore.WRITE_TIMEOUT);
  }
}
