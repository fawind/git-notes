import * as git from 'isomorphic-git';
import * as FS from '@isomorphic-git/lightning-fs';

const FS_NAME = 'git-fs';
const ROOT_DIR = '/';

const fs: any = new FS(FS_NAME);
const pfs: PromiseFS = fs.promises;

console.log({pfs, git});

export const initFS = () => {
  git.plugins.set('fs', fs);
};

export const cloneRepo = async () => {
  console.log('Cloning repo');
  await git.clone({
    dir: ROOT_DIR,
    corsProxy: 'https://cors.isomorphic-git.org',
    url: 'https://github.com/isomorphic-git/isomorphic-git',
    ref: 'master',
    singleBranch: true,
    depth: 10
  });
  const res = await pfs.readdir(ROOT_DIR);
  console.log(res);
};
