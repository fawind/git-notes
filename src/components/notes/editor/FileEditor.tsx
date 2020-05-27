import * as React from "react";

import "./editor.css";
import { EditorContent } from "@src/components/notes/editor/EditorContent";
import { EditorToolbar } from "@src/components/notes/editor/EditorToolbar";
import { CurrentFile, FileEntry, ThemeSettings } from "@src/store/types";
import { AppState } from "@src/store/appState";
import { WriteFile } from "@src/store/thunks/fileSystemThunks";
import { connect } from "react-redux";
import { FileSearch } from "@src/components/notes/fileSearch/FileSearch";
import { GlobalHotKeys } from "react-hotkeys";
import { ToggleFileSearch } from "@src/store/actions";

interface Props {
  currentFile: CurrentFile | null;
  theme: ThemeSettings;
  onSave: (file: FileEntry, getContent: () => string) => void;
  toggleFileSearch: () => void;
}

const FileEditorComponent: React.FC<Props> = (props: Props) => {
  const keyMap = { TOGGLE_FILE_SEARCH: "command+k" };
  const handlers = { TOGGLE_FILE_SEARCH: props.toggleFileSearch };

  return (
    <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
      <div className="editor">
        <EditorToolbar currentFile={props.currentFile} />
        <EditorContent currentFile={props.currentFile} onSave={props.onSave} theme={props.theme} />
        <FileSearch />
      </div>
    </GlobalHotKeys>
  );
};

const mapStateToProps = (state: AppState) => ({
  currentFile: state.currentFile,
  theme: state.settings.theme,
});

const mapDispatchToProps = (dispatch: any) => ({
  onSave: (file: FileEntry, getContent: () => string) => dispatch(WriteFile(file, getContent)),
  toggleFileSearch: () => dispatch(ToggleFileSearch.create({})),
});

export const FileEditor = connect(mapStateToProps, mapDispatchToProps)(FileEditorComponent);
