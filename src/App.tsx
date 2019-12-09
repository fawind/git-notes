import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter, Redirect, Route} from 'react-router-dom';
import {Provider} from 'mobx-react';

import 'main.css';
import {FileService} from '@src/services/fileService';
import {FileTreeStore} from '@src/store/fileTreeStore';
import {EditorApp} from '@src/components/notes/EditorApp';
import {GitService} from '@src/services/gitService';
import {SettingsStore} from '@src/store/settingsStore';
import {Landing} from '@src/components/landing/Landing';
import {FileEditStore} from '@src/store/fileEditStore';

const settingsStore = new SettingsStore();
const fileService = new FileService();
const gitService = new GitService(fileService);
const fileTreeStore = new FileTreeStore(fileService);
const fileEditStore = new FileEditStore(fileService, gitService);

fileTreeStore.init();

const app: React.ReactElement<any> = (
    <Provider
        fileTreeStore={fileTreeStore}
        settingsStore={settingsStore}
        fileEditStore={fileEditStore}
        gitService={gitService}
    >
      <HashRouter>
        {settingsStore.hasRepo
            ? <Route exact={true} path={'/'} component={EditorApp}/>
            : <Redirect to={'/landing'}/>}
        <Route exact={true} path={'/landing'} component={Landing} active={true}/>
      </HashRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('app'));
