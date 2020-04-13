import * as git from "isomorphic-git";
import { PushResult } from "isomorphic-git";
// tslint:disable-next-line:no-submodule-imports
import * as http from "isomorphic-git/http/web";
import { FileEntry, FileType, RepoSettings } from "@src/store/types";
import { FileSystem } from "@src/services/fileSystem";

export class GitService {
  private static GIT_DIR = "/";

  static async clone(repo: RepoSettings) {
    console.log("clone", repo);
    console.log("Clearing FS...");
    await FileSystem.wipe();
    await git.clone({
      fs: FileSystem.getBacking(),
      http: http,
      dir: this.GIT_DIR,
      singleBranch: true,
      depth: 1,
      url: repo.url!,
      ref: repo.branch,
      ...this.getCorsProxy(repo),
      onAuth: () => this.getAuth(repo),
    });
    console.log("Finished cloning.");
  }

  static async getModifiedFiles(): Promise<FileEntry[]> {
    const status = await git.statusMatrix({
      fs: FileSystem.getBacking(),
      dir: this.GIT_DIR,
    });
    const FILE = 0,
      HEAD = 1,
      WORKDIR = 2;
    return status
      .filter((row) => row[HEAD] !== row[WORKDIR])
      .map((row) => ({ path: row[FILE], type: FileType.FILE }));
  }

  static async checkoutFile(file: FileEntry, repo: RepoSettings): Promise<void> {
    await git.checkout({
      fs: FileSystem.getBacking(),
      dir: this.GIT_DIR,
      ref: repo.branch,
      filepaths: [this.getPath(file)],
    });
  }

  static async pull(repo: RepoSettings): Promise<void> {
    await git.pull({
      fs: FileSystem.getBacking(),
      http,
      dir: this.GIT_DIR,
      author: {
        name: repo.user!,
        email: repo.email!,
      },
      ...this.getCorsProxy(repo),
      onAuth: () => this.getAuth(repo),
    });
  }

  static async addAll(): Promise<void> {
    const repo = {
      fs: FileSystem.getBacking(),
      dir: this.GIT_DIR,
    };
    await git.statusMatrix(repo).then((status) =>
      Promise.all(
        status.map(([filepath, , worktreeStatus]) => {
          worktreeStatus ? git.add({ ...repo, filepath }) : git.remove({ ...repo, filepath });
        })
      )
    );
  }

  static async commit(repo: RepoSettings): Promise<void> {
    await git.commit({
      fs: FileSystem.getBacking(),
      dir: this.GIT_DIR,
      author: {
        name: repo.user!,
        email: repo.email!,
      },
      message: repo.defaultCommitMessage,
    });
  }

  static async push(repo: RepoSettings): Promise<void> {
    const response: PushResult = await git.push({
      fs: FileSystem.getBacking(),
      http,
      dir: this.GIT_DIR,
      ...this.getCorsProxy(repo),
      onAuth: () => this.getAuth(repo),
    });
    if (response.error) {
      throw new Error(`Error pushing changes: ${response.error}`);
    }
  }

  private static getPath(file: FileEntry): string {
    if (file.path.length > 0 && file.path[0] === "/") {
      return file.path.substr(1);
    }
    return file.path;
  }

  private static getCorsProxy(repo: RepoSettings): {} | { corsProxy: string } {
    return repo.corsProxy === null ? {} : { corsProxy: repo.corsProxy };
  }

  private static getAuth(repo: RepoSettings): { username: string; password?: string } {
    if (!repo.user) {
      throw new Error("No user name set");
    }
    if (!repo.token) {
      return { username: repo.user };
    }
    return { username: repo.user, password: repo.token };
  }
}
