import * as React from "react";

import "./fileTree.css";
import { FileTreeItem, FileType } from "@src/store/types";
import { AppState } from "@src/store/appState";
import { getFileTreeChildren, getFileTreeRoot } from "@src/store/selectors/fileTreeSelectors";
import { InitFileTree, ReadFile, ToggleFileTreeDir } from "@src/store/thunks/fileSystemThunks";
import { connect } from "react-redux";
import { FilePathUtils } from "@src/services/fileService";

interface Props {
  entries: FileTreeItem[];
  showHiddenFiles: boolean;
  getChildren: (entry: FileTreeItem) => FileTreeItem[];
  toggleDir: (item: FileTreeItem) => void;
  openFile: (file: FileTreeItem) => void;
}

interface TreeItemProps {
  item: FileTreeItem;
  onClick: (file: FileTreeItem) => void;
}

interface TreeDirProps {
  item: FileTreeItem;
  showHiddenFiles: boolean;
  getChildren: (entry: FileTreeItem) => FileTreeItem[];
  toggleDir: (item: FileTreeItem) => void;
  openFile: (file: FileTreeItem) => void;
}

const TreeItemFile: React.FC<TreeItemProps> = (props: TreeItemProps) => {
  const onClick = () => props.onClick(props.item);
  return (
    <li key={props.item.file.path}>
      <div className="entry" onClick={onClick}>
        {FilePathUtils.getFileName(props.item.file.path)}
      </div>
    </li>
  );
};

const TreeItemDir: React.FC<TreeDirProps> = (props: TreeDirProps) => {
  const onClick = () => props.toggleDir(props.item);
  const expandedIcon = props.item.isExpanded ? "▾" : "▸";
  return (
    <li key={props.item.file.path}>
      <div className="entry" onClick={onClick}>
        {expandedIcon} {FilePathUtils.getFileName(props.item.file.path)}
      </div>
      {props.item.isExpanded && props.item.children !== null ? (
        <FileTreeRoot
          entries={props.getChildren(props.item)}
          showHiddenFiles={props.showHiddenFiles}
          getChildren={props.getChildren}
          toggleDir={props.toggleDir}
          openFile={props.openFile}
        />
      ) : (
        <div />
      )}
    </li>
  );
};

const FileTreeRoot: React.FC<Props> = (props: Props) => {
  const filterHidden = (item: FileTreeItem): boolean =>
    props.showHiddenFiles || !FilePathUtils.getFileName(item.file.path).startsWith(".");
  const fileTree = props.entries.filter(filterHidden).map((entry) => {
    if (entry.file.type === FileType.FILE) {
      return <TreeItemFile key={entry.file.path} item={entry} onClick={props.openFile} />;
    }
    return (
      <TreeItemDir
        key={entry.file.path}
        item={entry}
        showHiddenFiles={props.showHiddenFiles}
        toggleDir={props.toggleDir}
        openFile={props.openFile}
        getChildren={props.getChildren}
      />
    );
  });
  return <ul>{fileTree}</ul>;
};

const FileTreeWrapper: React.FC<Props> = (props: Props) => {
  return (
    <div className={"file-tree"}>
      <FileTreeRoot {...props} />
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  entries: getFileTreeRoot(state.fileTree),
  showHiddenFiles: state.settings.appSettings.showHiddenFiles,
  getChildren: (entry: FileTreeItem) => getFileTreeChildren(state.fileTree, entry),
});

const mapDispatchToProps = (dispatch: any) => {
  dispatch(InitFileTree());
  return {
    toggleDir: (item: FileTreeItem) => dispatch(ToggleFileTreeDir(item)),
    openFile: (item: FileTreeItem) => dispatch(ReadFile(item.file)),
  };
};

export const FileTree = connect(mapStateToProps, mapDispatchToProps)(FileTreeWrapper);
