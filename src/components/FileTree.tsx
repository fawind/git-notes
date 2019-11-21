import * as React from 'react';
import {ReactElement} from 'react';
import {observer} from 'mobx-react';
import {FileStore, FileTreeItem} from '@src/store/fileStore';


type Props = {
  readonly fileStore: FileStore;
  readonly entries: FileTreeItem[];
}

export const FileTree: React.FunctionComponent<Props> = observer((props: Props): ReactElement => {
  const fileTree = props.entries.map(entry => {
    if (!entry.canExpand) {
      return <li key={entry.file.path}>{entry.name}</li>;
    }
    return (
        <li key={entry.file.path}>
          <div onClick={() => props.fileStore.toggleDir(entry)}>
            {(entry.name)}
          </div>
          {entry.isExpanded && entry.children !== null ?
              <FileTree fileStore={props.fileStore} entries={entry.children}/> : <div/>}
        </li>
    );
  });
  return (
      <ul>{fileTree}</ul>
  );
});
