import * as React from "react";

import "./fileTreeActions.css";
import { CreateFile } from "@src/store/thunks/fileSystemThunks";
import { connect } from "react-redux";
import { SyncChanges } from "@src/store/thunks/gitThunks";

interface Props {
  onCreate: () => void;
  onSync: () => void;
}

const FileTreeActionsComponent: React.FC<Props> = (props: Props) => {
  return (
    <div className="file-tree-actions">
      <a onClick={props.onCreate}>New File</a> | <a onClick={props.onSync}>Sync</a> |{" "}
      <a>Settings</a>
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: any) => ({
  onCreate: () => dispatch(CreateFile()),
  onSync: () => dispatch(SyncChanges()),
});

export const FileTreeActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileTreeActionsComponent);
