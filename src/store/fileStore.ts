import {action, computed, observable, runInAction} from 'mobx';
import {FileEntry} from '@src/store/types';
import {FileService} from '@src/services/fileService';

export class FileStore {
  private readonly fileService: FileService;
  @observable private files: FileEntry[] = [];

  constructor(fileService: FileService) {
    this.fileService = fileService;
  }

  @computed
  get rootFiles(): FileEntry[] {
    return this.files;
  }

  @action.bound
  async init() {
    const files = await this.fileService.listRoot();
    runInAction(() => this.files = files);
  }
}
