import * as React from 'react';
import {ReactElement} from 'react';
import {inject, observer} from 'mobx-react';
import {FileStore} from '@src/store/fileStore';
import {FileTree} from '@src/components/FileTree';


type Props = {
  readonly store: FileStore;
}

export const FileBrowser: React.FunctionComponent<Props> = inject('store')(observer((props: Props): ReactElement => {
  return (
      <FileTree fileStore={props.store} entries={props.store.fileTree}/>
  );
}));
