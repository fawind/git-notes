import * as React from 'react';
import {ReactElement} from 'react';
import {inject, observer} from 'mobx-react';
import {FileStore} from '@src/store/fileStore';


type Props = {
  readonly store: FileStore;
}

export const FileTree: React.FunctionComponent<Props> = inject('store')(observer((props: Props): ReactElement => {
  const files = props.store.rootFiles;
  return (
      <ul>
        {files.map((file, i) => (<li key={i}>{file.path}</li>))}
      </ul>
  );
}));
