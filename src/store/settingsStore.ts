import {observable, set, toJS} from 'mobx';

const STORE_KEY = 'settings';

export class SettingsStore {
  @observable url: string | null = null;
  @observable user: string | null = null;
  @observable token: string | null = null;

  constructor() {
    this.load();
  }

  save() {
    const state = toJS(this);
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }

  private load() {
    const rawState = localStorage.getItem(STORE_KEY);
    if (rawState !== null) {
      set(this, JSON.parse(rawState));
    }
  }
}
