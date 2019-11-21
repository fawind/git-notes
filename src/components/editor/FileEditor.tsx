import * as React from 'react';
import {ReactElement} from 'react';
import {inject, observer} from 'mobx-react';
import {FileStore} from '@src/store/fileStore';

type Props = {
  readonly fileStore?: FileStore;
}

export const FileEditor: React.FunctionComponent<Props> = inject('fileStore')(observer((props: Props): ReactElement => {
  if (props.fileStore!.currentFile === null) {
    return <div/>;
  }
  return (
      <div style={{height: '100%'}}>
        <div><b>{props.fileStore!.currentFile.file.name}</b></div>
        <textarea
            className="editor"
            readOnly={true}
            value={props.fileStore!.currentFile.content}
        />
      </div>
  );
}));
