import * as React from 'react';
import {ReactElement} from 'react';
import {inject, observer} from 'mobx-react';
import {FileStore, FileTreeItem} from '@src/store/fileStore';
import {SettingsStore} from '@src/store/settingsStore';

type Props = {
  readonly fileStore?: FileStore;
  readonly settingsStore?: SettingsStore;
  readonly entries?: FileTreeItem[];
}

export const FileTree: React.FunctionComponent<Props> = inject('fileStore', 'settingsStore')
(observer((props: Props): ReactElement => {
  const treeEntries = (props.entries ? props.entries : props.fileStore!.fileTree);
  const filterHidden = (entry: FileTreeItem) => {
    return props.settingsStore!.showHidden || !entry.file.name.startsWith('.');
  };

  const fileTree = treeEntries.filter(filterHidden).map(entry => {
    if (!entry.canExpand) {
      return (
          <li key={entry.file.path}>
            <div onClick={() => props.fileStore!.openFile(entry)}>
              {entry.file.name}
            </div>
          </li>);
    }
    return (
        <li key={entry.file.path}>
          <div onClick={() => props.fileStore!.toggleDir(entry)}>
            {entry.file.name}
          </div>
          {entry.isExpanded && entry.children !== null ?
              <FileTree fileStore={props.fileStore} entries={entry.children}/> : <div/>}
        </li>
    );
  });
  return (
      <ul>{fileTree}</ul>
  );
}));
