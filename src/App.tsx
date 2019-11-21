import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter, Route} from 'react-router-dom';
import {Provider} from 'mobx-react';

import 'main.css';
import {FileService} from '@src/services/fileService';
import {FileStore} from '@src/store/fileStore';
import {EditorApp} from '@src/components/editor/EditorApp';
import {GitService} from '@src/services/gitService';
import {RepoStore} from '@src/store/repoStore';
import {Landing} from '@src/components/landing/Landing';

const repoStore = new RepoStore();
const fileService = new FileService();
const gitService = new GitService(fileService);
const fileStore = new FileStore(fileService);
fileStore.init();

const app: React.ReactElement<any> = (
    <Provider
        fileStore={fileStore}
        repoStore={repoStore}
        gitService={gitService}
    >
      <HashRouter>
        <Route exact={true} path={'/'} component={EditorApp}/>
        <Route exact={true} path={'/landing'} component={Landing}/>
      </HashRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('app'));
