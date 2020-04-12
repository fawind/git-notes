import "reflect-metadata"; // Reflect Polyfill
import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter, Route } from "react-router-dom";

import { EditorApp } from "@src/components/notes/EditorApp";
import { Landing } from "@src/components/landing/Landing";
import { configureStore } from "@src/store/appState";
import { Settings } from "@src/store/types";
import { Provider } from "react-redux";
import "main.css";
import { LoadSettings } from "@src/store/actions";

const store = configureStore();
store.dispatch(LoadSettings.create({}));

const hasRepo = (settings: Settings): boolean => {
  return settings.repo.url !== null;
};

const app: React.ReactElement = (
  <Provider store={store}>
    <HashRouter>
      <Route exact={true} path={"/"} component={EditorApp} />
      <Route exact={true} path={"/landing"} component={Landing} />
    </HashRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("app"));
