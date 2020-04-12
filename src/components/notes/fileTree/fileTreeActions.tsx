import * as React from "react";

import "./fileTreeActions.css";
import { CreateFile } from "@src/store/thunks/fileSystemThunks";
import { connect } from "react-redux";

interface Props {
  onCreate: () => void;
}

const FileTreeActionsComponent: React.FC<Props> = (props: Props) => {
  return (
    <div className="file-tree-actions">
      <a onClick={props.onCreate}>New File</a> | <a>Sync Changes</a>
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: any) => ({
  onCreate: () => dispatch(CreateFile()),
});

export const FileTreeActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileTreeActionsComponent);
