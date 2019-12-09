import * as React from 'react';
import {ReactElement} from 'react';
import {inject, observer} from 'mobx-react';

import './fileTree.css';
import {FileTreeItem, FileTreeStore} from '@src/store/fileTreeStore';
import {SettingsStore} from '@src/store/settingsStore';
import {FileEditStore} from '@src/store/fileEditStore';

type Props = {
  readonly fileTreeStore?: FileTreeStore;
  readonly fileEditStore?: FileEditStore;
  readonly settingsStore?: SettingsStore;
  readonly entries?: FileTreeItem[];
}

type ItemProps = {
  readonly fileTreeStore?: FileTreeStore;
  readonly fileEditStore?: FileEditStore;
  readonly item: FileTreeItem;
};

const TreeItemFile: React.FC<ItemProps> = inject('fileEditStore')(observer((props) => {
  const onClick = () => props.fileEditStore!.openFile(props.item.file);
  return (
      <li key={props.item.file.path}>
        <div onClick={onClick}>{props.item.file.name}</div>
      </li>
  );
}));

const TreeItemDir: React.FC<ItemProps> = inject('fileTreeStore')(observer((props) => {
  const onClick = () => props.fileTreeStore!.toggleDir(props.item);
  const expandedIcon = props.item.isExpanded ? '▾' : '▸';
  return (
      <li key={props.item.file.path}>
        <div onClick={onClick}>
          {expandedIcon} {props.item.file.name}
        </div>
        {props.item.isExpanded && props.item.children !== null ?
            <FileTree entries={props.item.children}/> : <div/>}
      </li>
  );
}));

export const FileTree: React.FunctionComponent<Props> = inject('fileTreeStore', 'fileEditStore', 'settingsStore')
(observer((props: Props): ReactElement => {
  const treeEntries = (props.entries ? props.entries : props.fileTreeStore!.fileTree);
  const filterHidden = (entry: FileTreeItem) => {
    return props.settingsStore!.showHidden || !entry.file.name.startsWith('.');
  };
  const fileTree = treeEntries.filter(filterHidden).map(entry => {
    if (!entry.canExpand) {
      return <TreeItemFile key={entry.file.path} item={entry}/>;
    }
    return <TreeItemDir key={entry.file.path} item={entry}/>;
  });
  return (
      <ul className="file-tree">{fileTree}</ul>
  );
}));
