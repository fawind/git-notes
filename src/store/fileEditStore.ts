import {action, computed, observable, runInAction} from 'mobx';
import {FileEntry} from '@src/store/types';
import {FileService} from '@src/services/fileService';
import {GitService} from '@src/services/gitService';

export class OpenFile {
  constructor(readonly file: FileEntry, readonly content: string) {
  }
}

export class FileEditStore {
  private readonly fileService: FileService;
  private readonly gitService: GitService;
  @observable private _openFile: OpenFile | null = null;

  constructor(fileService: FileService, gitService: GitService) {
    this.fileService = fileService;
    this.gitService = gitService;
  }

  @computed
  get currentFile(): OpenFile | null {
    return this._openFile;
  }

  @action.bound
  async openFile(file: FileEntry) {
    FileService.assertFile(file);
    const content = await this.fileService.readFile(file);
    runInAction(() => this._openFile = new OpenFile(file, content));
  }
}
