import {observable} from 'mobx';

export class RepoStore {
  @observable url: string | null = null;
  @observable user: string | null = null;
  @observable token: string | null = null;
}
