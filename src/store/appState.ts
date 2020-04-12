import { CurrentFile, FileTree, Settings } from "@src/store/types";
import {
  Action,
  applyMiddleware,
  compose,
  createStore,
  Store,
  StoreEnhancer,
} from "redux";
import { combineReducers, loggingMiddleware, TypedAction } from "redoodle";
import { openFileReducer } from "@src/store/reducers/openFileReducer";
import { fileTreeReducer } from "@src/store/reducers/fileTreeReducer";
import { settingsReducer } from "@src/store/reducers/settingsReducer";
import thunkMiddleware, { ThunkMiddleware } from "redux-thunk";

export interface AppState {
  currentFile: CurrentFile | null;
  fileTree: FileTree;
  settings: Settings;
}

const defaultSettings: Settings = {
  repo: {
    url: null,
    user: null,
    token: null,
    email: null,
    corsProxy: "https://cors.isomorphic-git.org",
    branch: "master",
    defaultCommitMessage: "Auto save",
  },
  appSettings: {
    showHiddenFiles: false,
    showSidebar: true,
  },
  theme: {
    bg: "#fbfbfb",
    bgLight: "#f4f5f4",
    fg: "#444",
    fgLight: "#a3abb3",
    primary: "#DD4C4F",
    link: "#0366d6",
  },
};

const initialState: AppState = {
  currentFile: null,
  fileTree: {},
  settings: defaultSettings,
};

export function configureStore(): Store<AppState> {
  return createStore(
    combineReducers<AppState>({
      currentFile: openFileReducer,
      fileTree: fileTreeReducer,
      settings: settingsReducer,
    }),
    initialState,
    compose(
      applyMiddleware(
        thunkMiddleware as ThunkMiddleware<AppState, Action>,
        loggingMiddleware({ enableInProduction: false })
      )
    ) as StoreEnhancer
  );
}
