import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter, Redirect, Route } from "react-router-dom";

import { EditorApp } from "@src/components/notes/EditorApp";
import { Landing } from "@src/components/landing/Landing";
import { configureStore } from "@src/store/appState";
import { Provider } from "react-redux";
import "main.css";
import { LoadSettings } from "@src/store/actions";

const store = configureStore();
store.dispatch(LoadSettings.create({}));

const EditorRedirect: React.FC = () => {
  const hasRepo = store.getState().settings.repo.url !== null;
  return (
    <Route
      render={(props) => (hasRepo ? <EditorApp {...props} /> : <Redirect to={"/landing"} />)}
    />
  );
};

const app: React.ReactElement = (
  <Provider store={store}>
    <HashRouter>
      <Route exact={true} path={"/"} component={EditorRedirect} />
      <Route exact={true} path={"/landing"} component={Landing} />
    </HashRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("app"));
