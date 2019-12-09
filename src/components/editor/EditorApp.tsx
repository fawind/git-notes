import * as React from 'react';
import {ReactElement} from 'react';
import {inject, observer} from 'mobx-react';
import {FileTreeStore} from '@src/store/fileTreeStore';
import {FileTree} from '@src/components/editor/FileTree';
import {FileEditor} from '@src/components/editor/FileEditor';


type Props = {
  readonly fileTreeStore: FileTreeStore;
}

export const EditorApp: React.FunctionComponent<Props> = inject('fileTreeStore')(observer((props: Props): ReactElement => {
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
