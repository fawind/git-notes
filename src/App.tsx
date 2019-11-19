import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter, Route} from 'react-router-dom';
import {Provider} from 'mobx-react';

import 'main.css';
import {FileService} from '@src/services/fileService';
import {FileStore} from '@src/store/fileStore';
import {FileTree} from '@src/components/fileTree';


const fileService = new FileService();
const fileStore = new FileStore(fileService);
fileStore.init();

const app: React.ReactElement<any> = (
    <Provider store={fileStore}>
      <HashRouter>
        <Route exact={true} path={'/'} component={FileTree}/>
      </HashRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('app'));
