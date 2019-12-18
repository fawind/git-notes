import * as React from 'react';

import './fileTree.css';
import {FileTreeItem, FileTreeStore} from '@src/store/fileTreeStore';
import {SettingsStore} from '@src/store/settingsStore';
import {FileEditStore} from '@src/store/fileEditStore';
import {inject} from '@src/appModule';
import {observer} from 'mobx-react';
import {FileEntry} from '@src/store/types';
import {FileStatusStore} from '@src/store/fileStatusStore';

type Props = {
  readonly entries?: FileTreeItem[];
}

type ItemProps = {
  readonly item: FileTreeItem;
};

@observer
class TreeItemFile extends React.PureComponent<ItemProps> {
  @inject(FileEditStore) private fileEditStore: FileEditStore;
  @inject(FileStatusStore) private fileStatusStore: FileStatusStore;

  constructor(props: ItemProps) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.getFileName = this.getFileName.bind(this);
  }

  private getFileName(file: FileEntry): JSX.Element {
    if (this.fileStatusStore.isModified(file)) {
      return <span>{file.name}<span className="primary">*</span></span>;
    }
    return <span>{file.name}</span>;
  }

  private onClick() {
    this.fileEditStore.openFile(this.props.item.file);
  }

  render() {
    return (
        <li key={this.props.item.file.path}>
          <div onClick={this.onClick}>{this.getFileName(this.props.item.file)}</div>
        </li>
    );
  }
}

@observer
class TreeItemDir extends React.PureComponent<ItemProps> {
  @inject(FileTreeStore) private fileTreeStore: FileTreeStore;

  constructor(props: ItemProps) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  private onClick() {
    this.fileTreeStore.toggleDir(this.props.item);
  }

  render() {
    const expandedIcon = this.props.item.isExpanded ? '▾' : '▸';
    return (
        <li key={this.props.item.file.path}>
          <div onClick={this.onClick}>
            {expandedIcon} {this.props.item.file.name}
          </div>
          {this.props.item.isExpanded && this.props.item.children !== null ?
              <FileTree entries={this.props.item.children}/> : <div/>}
        </li>
    );
  }
}

@observer
export class FileTree extends React.PureComponent<Props> {
  @inject(FileTreeStore) private fileTreeStore: FileTreeStore;
  @inject(SettingsStore) private settingsStore: SettingsStore;

  constructor(props: Props) {
    super(props);
    this.filterHidden = this.filterHidden.bind(this);
  }

  private filterHidden(item: FileTreeItem): boolean {
    return this.settingsStore.showHidden || !item.file.name.startsWith('.');
  }

  render() {
    const treeEntries = (this.props.entries ? this.props.entries : this.fileTreeStore.fileTree);
    const fileTree = treeEntries.filter(this.filterHidden).map(entry => {
      if (!entry.canExpand) {
        return <TreeItemFile key={entry.file.path} item={entry}/>;
      }
      return <TreeItemDir key={entry.file.path} item={entry}/>;
    });
    return (
        <ul className="file-tree">{fileTree}</ul>
    );
  }
}
