import * as git from 'isomorphic-git';
import {PushResponse} from 'isomorphic-git';
import {FileEntry} from '@src/store/types';
import {FileService} from '@src/services/fileService';
import {inject, injectable} from 'inversify';
import {appSymbols} from '@src/appModule';
import {SettingsStore} from '@src/store/settingsStore';

@injectable()
export class GitService {
  private static readonly GIT_FS_KEY = 'fs';
  private readonly fileService: FileService;
  private readonly settingsStore: SettingsStore;
  private corsProxy = 'https://cors.isomorphic-git.org';
  private rootDir: FileEntry;

  constructor(
      @inject(FileService) fileService: FileService,
      @inject(SettingsStore) settingsStore: SettingsStore,
      @inject(appSymbols.ROOT_DIR) rootDir: FileEntry) {
    this.fileService = fileService;
    this.settingsStore = settingsStore;
    this.rootDir = rootDir;
    git.plugins.set(GitService.GIT_FS_KEY, this.fileService.getFSInstance());
    // For debugging
    (<any>window).git = git;
    (<any>window).gitService = this;
  }

  async clone(url: string, username: string, token: string) {
    console.log('Clearing FS...');
    await this.fileService.wipeFs();
    console.log(`Cloning repo "${url}"...`);
    await git.clone({
      dir: this.rootDir.path,
      corsProxy: this.corsProxy,
      singleBranch: true,
      depth: 1,
      username,
      token,
      url,
    });
    console.log('Finished cloning.');
  }

  async getModifiedFiles(): Promise<FileEntry[]> {
    const status = await git.statusMatrix({dir: this.rootDir.path});
    const FILE = 0, HEAD = 1, WORKDIR = 2;
    return status
        .filter(row => row[HEAD] !== row[WORKDIR])
        .map(row => FileEntry.file(row[FILE]));
  }

  async checkoutFile(file: FileEntry): Promise<void> {
    await git.checkout({
      dir: this.rootDir.path,
      ref: this.settingsStore.branch,
      pattern: this.getPath(file),
    });
  }

  async pushFile(file: FileEntry): Promise<void> {
    if (!this.settingsStore.token) {
      throw new Error('No git token set');
    }
    if (!this.settingsStore.user) {
      throw new Error('No user name set');
    }
    await git.add({dir: this.rootDir.path, filepath: this.getPath(file)});
    await git.commit({
      dir: this.rootDir.path,
      author: {
        name: this.settingsStore.user,
        email: this.settingsStore.email,
      },
      message: this.settingsStore.commitMessage,
    });
    const response: PushResponse = await git.push({
      dir: '/',
      remote: 'origin',
      ref: 'master',
      oauth2format: 'github',
      corsProxy: this.corsProxy,
      token: this.settingsStore.token,
      force: true,
    });
    console.log('Response:', response);
    if (response.errors && response.errors.length > 0) {
      throw new Error(`Error pushing changes: ${response.errors.join('.\n')}`);
    }
  }

  private getPath(file: FileEntry): string {
    if (file.path.length > 0 && file.path[0] === '/') {
      return file.path.substr(1);
    }
    return file.path;
  }
}
