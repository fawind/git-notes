import * as React from 'react';
import {ReactElement} from 'react';
import {inject, observer} from 'mobx-react';
import {FileTreeItem, FileTreeStore} from '@src/store/fileTreeStore';
import {SettingsStore} from '@src/store/settingsStore';
import {FileEditStore} from '@src/store/fileEditStore';

type Props = {
  readonly fileTreeStore?: FileTreeStore;
  readonly fileEditStore?: FileEditStore;
  readonly settingsStore?: SettingsStore;
  readonly entries?: FileTreeItem[];
}

export const FileTree: React.FunctionComponent<Props> = inject('fileTreeStore', 'fileEditStore', 'settingsStore')
(observer((props: Props): ReactElement => {
  const treeEntries = (props.entries ? props.entries : props.fileTreeStore!.fileTree);
  const filterHidden = (entry: FileTreeItem) => {
    return props.settingsStore!.showHidden || !entry.file.name.startsWith('.');
  };

  const fileTree = treeEntries.filter(filterHidden).map(entry => {
    if (!entry.canExpand) {
      return (
          <li key={entry.file.path}>
            <div onClick={() => props.fileEditStore!.openFile(entry.file)}>
              {entry.file.name}
            </div>
          </li>);
    }
    return (
        <li key={entry.file.path}>
          <div onClick={() => props.fileTreeStore!.toggleDir(entry)}>
            {entry.file.name}
          </div>
          {entry.isExpanded && entry.children !== null ?
              <FileTree fileTreeStore={props.fileTreeStore} entries={entry.children}/> : <div/>}
        </li>
    );
  });
  return (
      <ul>{fileTree}</ul>
  );
}));
