import * as React from 'react';
import {ReactElement} from 'react';
import {inject, observer} from 'mobx-react';
import {FileStore} from '@src/store/fileStore';
import {FileTree} from '@src/components/FileTree';
import {FileEditor} from '@src/components/FileEditor';


type Props = {
  readonly fileStore: FileStore;
}

export const EditorApp: React.FunctionComponent<Props> = inject('fileStore')(observer((props: Props): ReactElement => {
  return (
      <div className="container">
        <div className="side-bar">
          <FileTree/>
        </div>
        <div className="main-panel">
          <FileEditor/>
        </div>
      </div>
  );
}));
