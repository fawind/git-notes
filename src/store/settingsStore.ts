import {observable, set, toJS} from 'mobx';
import {injectable} from 'inversify';

const STORE_KEY = 'settings';

export type AppTheme = {
  bg: string;
  bgLight: string;
  fg: string;
  fgLight: string;
  primary: string
  link: string;
};

@injectable()
export class SettingsStore {
  // Repo settings
  @observable hasRepo = false;
  @observable url: string | null = null;
  @observable user: string | null = null;
  @observable token: string | null = null;
  // FileTree settings
  @observable showHidden: false;
  // Theme settings
  @observable theme: AppTheme = {
    bg: '#fbfbfb',
    bgLight: '#f4f5f4',
    fg: '#444',
    fgLight: '#a3abb3',
    primary: '#DD4C4F',
    link: '#0366d6',
  };

  constructor() {
    this.load();
    this.updateTheme();
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

  private updateTheme() {
    Object.entries(this.theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value!);
    });
  }
}
