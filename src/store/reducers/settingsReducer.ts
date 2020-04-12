import { TypedReducer } from "redoodle";
import { Settings, ThemeSettings } from "@src/store/types";
import { LoadSettings, SetCloneSettings } from "@src/store/actions";

const STORE_KEY = "settings";

export const settingsReducer = TypedReducer.builder<Settings>()
  .withHandler(LoadSettings.TYPE, (state) => {
    const settings = loadSettings(state);
    applyTheme(settings.theme);
    return settings;
  })
  .withHandler(SetCloneSettings.TYPE, (state, { url, user, token }) => {
    const settings = { ...state, repo: { ...state.repo, url, user, token } };
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
