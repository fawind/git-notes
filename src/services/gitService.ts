import * as FS from '@isomorphic-git/lightning-fs';
import * as git from 'isomorphic-git';
import {FileEntry, FileType} from '@src/store/types';

export class GitService {
  private static readonly GIT_FS_KEY = 'fs';
  private corsProxy = 'https://cors.isomorphic-git.org';
  private rootDir: FileEntry;

  constructor(
      fileSystem: typeof FS,
      rootDir: FileEntry = new FileEntry('/', FileType.Directory)
  ) {
    this.rootDir = rootDir;
    git.plugins.set(GitService.GIT_FS_KEY, fileSystem);
  }

  async clone(url: string) {
    return git.clone({
      dir: this.rootDir.path,
      corsProxy: this.corsProxy,
      singleBranch: true,
      depth: 1,
      url,
    });
  }
}
