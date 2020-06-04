import { TypedReducer } from "redoodle";
import { Settings, ThemeSettings } from "@src/store/types";
import { LoadSettings, SetCloneSettings, ToggleFileTree } from "@src/store/actions";

const STORE_KEY = "settings";

export const settingsReducer = TypedReducer.builder<Settings>()
  .withHandler(LoadSettings.TYPE, (state) => {
    const settings = { ...state, ...loadSettings(state) };
    applyTheme(settings.theme);
    return settings;
  })
  .withHandler(SetCloneSettings.TYPE, (state, { url, user, email, token }) => {
    const settings = { ...state, repo: { ...state.repo, url, user, email, token } };
    saveSettings(settings);
    return settings;
  })
  .withHandler(ToggleFileTree.TYPE, (state) => {
    const settings = { ...state };
    settings.appSettings.showFileTree = !settings.appSettings.showFileTree;
    saveSettings(settings);
    return settings;
  })
  .build();

const applyTheme = (theme: ThemeSettings) => {
  Object.entries(theme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value!);
  });
};

const loadSettings = (defaultSettings: Settings): Settings => {
  const rawState = localStorage.getItem(STORE_KEY);
  if (rawState === null) {
    return defaultSettings;
  }
  return JSON.parse(rawState);
};

const saveSettings = (settings: Settings) => {
  localStorage.setItem(STORE_KEY, JSON.stringify(settings));
};
