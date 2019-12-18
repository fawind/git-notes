import {inject, injectable} from 'inversify';
import {GitService} from '@src/services/gitService';
import {action, observable, runInAction} from 'mobx';
import {FileEntry} from '@src/store/types';
import {createTransformer} from 'mobx-utils';

@injectable()
export class FileStatusStore {
  private readonly gitService: GitService;
  @observable private _modifiedFiles: FileEntry[] = [];

  constructor(@inject(GitService) gitService: GitService) {
    this.gitService = gitService;
  }

  isModified = createTransformer((file: FileEntry) => {
    return this._modifiedFiles.some(f => f.path === file.path);
  });

  @action.bound
  async updateModifiedFiles() {
    const modifiedFiles = await this.gitService.getModifiedFiles();
    runInAction(() => this._modifiedFiles = modifiedFiles);
  }
}
