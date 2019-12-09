import * as React from 'react';
import {ReactElement} from 'react';
import {inject, observer} from 'mobx-react';
import {FileEditStore} from '@src/store/fileEditStore';

type Props = {
  readonly fileEditStore?: FileEditStore;
}

export const FileEditor: React.FunctionComponent<Props> = inject('fileEditStore')(observer((props: Props): ReactElement => {
  if (props.fileEditStore!.currentFile === null) {
    return <div/>;
  }
  return (
      <div style={{height: '100%'}}>
        <div><b>{props.fileEditStore!.currentFile.file.name}</b></div>
        <textarea
            className="editor"
            readOnly={true}
            value={props.fileEditStore!.currentFile.content}
        />
      </div>
  );
}));
