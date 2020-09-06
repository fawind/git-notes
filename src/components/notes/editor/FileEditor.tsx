import * as React from "react";

import "./editor.css";
import { EditorContent } from "@src/components/notes/editor/EditorContent";
import { EditorToolbar } from "@src/components/notes/editor/EditorToolbar";
import { CurrentFile, FileEntry, ThemeSettings } from "@src/store/types";
import { AppState } from "@src/store/appState";
import { WriteFile } from "@src/store/thunks/fileSystemThunks";
import { connect } from "react-redux";
import { FileSearch } from "@src/components/notes/fileSearch/FileSearch";

interface Props {
  currentFile: CurrentFile | null;
  theme: ThemeSettings;
  onSave: (file: FileEntry, getContent: () => string) => void;
}

const FileEditorComponent: React.FC<Props> = (props: Props) => {
  return (
    <div className="editor">
      <EditorToolbar />
      <EditorContent currentFile={props.currentFile} onSave={props.onSave} theme={props.theme} />
      <FileSearch />
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  currentFile: state.currentFile,
  theme: state.settings.theme,
});

const mapDispatchToProps = (dispatch: any) => ({
  onSave: (file: FileEntry, getContent: () => string) => dispatch(WriteFile(file, getContent)),
});

export const FileEditor = connect(mapStateToProps, mapDispatchToProps)(FileEditorComponent);
