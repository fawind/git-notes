import * as React from 'react';
import {ReactElement} from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter, Route} from 'react-router-dom';

import 'main.css';
import {cloneRepo, initFS} from '@src/git';

initFS();
cloneRepo();

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
