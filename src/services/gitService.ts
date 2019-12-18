import * as git from 'isomorphic-git';
import {FileEntry} from '@src/store/types';
import {FileService} from '@src/services/fileService';
import {inject, injectable} from 'inversify';
import {appSymbols} from '@src/appModule';

@injectable()
export class GitService {
  private static readonly GIT_FS_KEY = 'fs';
  private readonly fileService: FileService;
  private corsProxy = 'https://cors.isomorphic-git.org';
  private rootDir: FileEntry;

  constructor(
      @inject(FileService) fileService: FileService,
      @inject(appSymbols.ROOT_DIR) rootDir: FileEntry) {
    this.fileService = fileService;
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
}
