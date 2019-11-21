import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter, Route} from 'react-router-dom';
import {Provider} from 'mobx-react';

import 'main.css';
import {FileService} from '@src/services/fileService';
import {FileStore} from '@src/store/fileStore';
import {FileTree} from '@src/components/fileTree';
import {GitService} from '@src/services/gitService';


const fileService = new FileService();
const fileStore = new FileStore(fileService);
const gitService = new GitService(fileService.getFSInstance());
fileStore.init();
    // .then(() => gitService.clone('https://github.com/fawind/overleaf-commander.git'))
    // .then(() => console.log('Finished cloning'));

const app: React.ReactElement<any> = (
    <Provider store={fileStore}>
      <HashRouter>
        <Route exact={true} path={'/'} component={FileTree}/>
      </HashRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('app'));
