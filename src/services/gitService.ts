import * as git from 'isomorphic-git';
import {FileEntry, FileType} from '@src/store/types';
import {FileService} from '@src/services/fileService';

export class GitService {
  private static readonly GIT_FS_KEY = 'fs';
  private readonly fileService: FileService;
  private corsProxy = 'https://cors.isomorphic-git.org';
  private rootDir: FileEntry;

  constructor(
      fileService: FileService,
      rootDir: FileEntry = new FileEntry('/', FileType.Directory)) {
    this.fileService = fileService;
    this.rootDir = rootDir;
    git.plugins.set(GitService.GIT_FS_KEY, this.fileService.getFSInstance());
    // For debugging
    (<any>window).git = git;
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
}
