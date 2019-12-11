import 'reflect-metadata'; // Reflect Polyfill
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter, Redirect, Route} from 'react-router-dom';

import 'main.css';
import {FileTreeStore} from '@src/store/fileTreeStore';
import {EditorApp} from '@src/components/notes/EditorApp';
import {Landing} from '@src/components/landing/Landing';
import {appContainer} from '@src/appModule';
import {SettingsStore} from '@src/store/settingsStore';

const fileTreeStore = appContainer.get<FileTreeStore>(FileTreeStore);
const settingsStore = appContainer.get<SettingsStore>(SettingsStore);
fileTreeStore.init();

const app: React.ReactElement<any> = (
    <HashRouter>
      {settingsStore.hasRepo
          ? <Route exact={true} path={'/'} component={EditorApp}/>
          : <Redirect to={'/landing'}/>}
      <Route exact={true} path={'/landing'} component={Landing} active={true}/>
    </HashRouter>
);

ReactDOM.render(app, document.getElementById('app'));
