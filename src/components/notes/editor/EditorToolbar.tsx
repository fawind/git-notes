import * as React from 'react';
import {ReactElement} from 'react';
import {inject, observer} from 'mobx-react';
import {FileEditStore} from '@src/store/fileEditStore';
import {SettingsStore} from '@src/store/settingsStore';

type Props = {
  readonly fileEditStore?: FileEditStore;
  readonly settingsStore?: SettingsStore;
}

const getLocationElements = (path: string) => {
  const elements: JSX.Element[] = [];
  const parts = path.split('/');
  parts.forEach((part, i) => {
    if (part === '') return;
    elements.push(<span key={i}>{part}</span>);
    if (i < parts.length - 1) {
      elements.push(<span key={`${i}-div`} className="path-divider">›</span>);
    }
  });
  return elements;
};

export const EditorToolbar: React.FunctionComponent<Props> = inject('fileEditStore', 'settingsStore')
(observer((props: Props): ReactElement => {
  return (
      <div className="editor-toolbar">
        <div>
          {getLocationElements(props.fileEditStore!.currentFile!.file.path)}
        </div>
        <div>
          Settings
        </div>
      </div>
  );
}));
