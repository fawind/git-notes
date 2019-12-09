import * as React from 'react';
import {ReactElement} from 'react';
import {inject, observer} from 'mobx-react';

import './editor.css';
import {FileEditStore} from '@src/store/fileEditStore';
import {SettingsStore} from '@src/store/settingsStore';
import {EditorContent} from '@src/components/notes/editor/EditorContent';
import {EditorToolbar} from '@src/components/notes/editor/EditorToolbar';

type Props = {
  readonly fileEditStore?: FileEditStore;
  readonly settingsStore?: SettingsStore;
}

export const FileEditor: React.FunctionComponent<Props> = inject('fileEditStore', 'settingsStore')
(observer((props: Props): ReactElement => {
  if (props.fileEditStore!.currentFile === null) {
    return <div/>;
  }
  return (
      <div className="editor">
        <EditorToolbar/>
        <EditorContent/>
      </div>
  );
}));
