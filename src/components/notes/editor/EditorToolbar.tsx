import * as React from "react";
import { CurrentFile, FileEntry } from "@src/store/types";
import { EditorToolbarOptions } from "@src/components/notes/editor/EditorToolbarOptions";
import { AppState } from "@src/store/appState";
import { DeleteFile, MoveFile } from "@src/store/thunks/fileSystemThunks";
import { connect } from "react-redux";

interface Props {
  currentFile: CurrentFile | null;
  deleteFile: (file: FileEntry) => void;
  moveFile: (file: FileEntry) => void;
}

const getFileLocation = (path: string): JSX.Element[] => {
  const elements: JSX.Element[] = [];
  const parts = path.split("/");
  parts.forEach((part, i) => {
    if (part === "") {
      return;
    }
    elements.push(<span key={i}>{part}</span>);
    if (i < parts.length - 1) {
      elements.push(
        <span key={`${i}-div`} className="path-divider">
          ›
        </span>
      );
    }
  });
  return elements;
};

const EditorToolbarComponent: React.FC<Props> = (props: Props) => {
  if (!props.currentFile) {
    return <div className="editor-toolbar">No note opened</div>;
  }
  return (
    <div className="editor-toolbar">
      <div>{getFileLocation(props.currentFile!.file.path)}</div>
      <EditorToolbarOptions
        currentFile={props.currentFile!.file}
        moveFile={props.moveFile}
        deleteFile={props.deleteFile}
      />
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  currentFile: state.currentFile,
});

const mapDispatchToProps = (dispatch: any) => ({
  moveFile: (file: FileEntry) => dispatch(MoveFile(file)),
  deleteFile: (file: FileEntry) => dispatch(DeleteFile(file)),
});

export const EditorToolbar = connect(mapStateToProps, mapDispatchToProps)(EditorToolbarComponent);
