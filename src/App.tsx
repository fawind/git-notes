import * as React from 'react';
import {ReactElement} from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter, Route} from 'react-router-dom';

import 'main.css';
import {FileService} from '@src/storage/fileService';


const fs = new FileService();
console.log('FileService', fs);
fs.listRoot().then(r => console.log(r));

const root: React.FunctionComponent<{}> = (): ReactElement => {
  return (
      <h1>
        Hello Git-Notes!
      </h1>
  );
};

const app: React.ReactElement<any> = (
    <HashRouter>
      <Route exact={true} path={'/'} component={root}/>
    </HashRouter>
);

ReactDOM.render(app, document.getElementById('app'));
