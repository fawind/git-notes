import * as git from 'isomorphic-git';
import {PushResult} from 'isomorphic-git';
// tslint:disable-next-line:no-submodule-imports
import * as http from 'isomorphic-git/http/web';
import {FileEntry} from '@src/store/types';
import {FileService} from '@src/services/fileService';
import {inject, injectable} from 'inversify';
import {appSymbols} from '@src/appModule';
import {SettingsStore} from '@src/store/settingsStore';

@injectable()
export class GitService {
  private readonly fileService: FileService;
  private readonly fs: any;
  private readonly settingsStore: SettingsStore;
  private corsProxy = 'https://cors.isomorphic-git.org';
  private rootDir: FileEntry;

  constructor(
    @inject(FileService) fileService: FileService,
    @inject(SettingsStore) settingsStore: SettingsStore,
    @inject(appSymbols.ROOT_DIR) rootDir: FileEntry) {
    this.fileService = fileService;
    this.fs = fileService.getFSInstance();
    this.settingsStore = settingsStore;
    this.rootDir = rootDir;
    // For debugging
    (window as any).git = git;
    (window as any).http = http;
    (window as any).gitService = this;
  }

  async clone() {
    console.log('Clearing FS...');
    await this.fileService.wipeFs();
    console.log(`Cloning repo "${this.settingsStore.url}"...`);
    await git.clone({
      fs: this.fileService.getFSInstance(),
      http: http,
      dir: this.rootDir.path,
      corsProxy: this.corsProxy,
      singleBranch: true,
      depth: 1,
      url: this.settingsStore.url!,
      onAuth: () => this.getAuth(),
    });
    console.log('Finished cloning.');
  }

  async getModifiedFiles(): Promise<FileEntry[]> {
    const status = await git.statusMatrix({fs: this.fs, dir: this.rootDir.path});
    const FILE = 0, HEAD = 1, WORKDIR = 2;
    return status
      .filter(row => row[HEAD] !== row[WORKDIR])
      .map(row => FileEntry.file(row[FILE]));
  }

  async checkoutFile(file: FileEntry): Promise<void> {
    await git.checkout({
      fs: this.fs,
      dir: this.rootDir.path,
      ref: this.settingsStore.branch,
      filepaths: [this.getPath(file)],
    });
  }

  async pushFile(file: FileEntry): Promise<void> {
    await git.add({fs: this.fs, dir: this.rootDir.path, filepath: this.getPath(file)});
    await git.commit({
      fs: this.fs,
      dir: this.rootDir.path,
      author: {
        name: this.settingsStore.user!,
        email: this.settingsStore.email,
      },
      message: this.settingsStore.commitMessage,
    });
    const response: PushResult = await git.push({
      fs: this.fs,
      http,
      dir: '/',
      corsProxy: this.corsProxy,
      onAuth: () => this.getAuth(),
    });
    if (response.error) {
      throw new Error(`Error pushing changes: ${response.error}`);
    }
  }

  async pull(): Promise<void> {
    await git.pull({
      fs: this.fs,
      http,
      dir: '/',
      corsProxy: this.corsProxy,
      onAuth: () => this.getAuth(),
    });
  }

  private getPath(file: FileEntry): string {
    if (file.path.length > 0 && file.path[0] === '/') {
      return file.path.substr(1);
    }
    return file.path;
  }

  private getAuth(): { username: string, password?: string } {
    if (!this.settingsStore.user) {
      throw new Error('No user name set');
    }
    if (!this.settingsStore.token) {
      return {username: this.settingsStore.user};
    }
    return {username: this.settingsStore.user, password: this.settingsStore.token};
  }
}
