import * as React from "react";
import { FileTree } from "@src/components/notes/fileTree/FileTree";
import { FileEditor } from "@src/components/notes/editor/FileEditor";
import { FileTreeActions } from "@src/components/notes/fileTree/fileTreeActions";
import { configure, GlobalHotKeys } from "react-hotkeys";
import { KeyBindingsSettings } from "@src/store/types";
import { AppState } from "@src/store/appState";
import { ToggleFileSearch, ToggleFileTree } from "@src/store/actions";
import { connect } from "react-redux";

interface Props {
  showFileTree: boolean;
  keyBindings: KeyBindingsSettings;
  toggleFileSearch: () => void;
  toggleFileTree: () => void;
}

const EditorAppComponent: React.FC<Props> = (props: Props) => {
  // Don't ignore events from <input> and similar components
  configure({ ignoreTags: [] });
  const keyMap = {
    [props.keyBindings.toggleFileSearch.key]: props.keyBindings.toggleFileSearch.shortcut,
    [props.keyBindings.toggleFileTree.key]: props.keyBindings.toggleFileTree.shortcut,
  };
  const handlers = {
    [props.keyBindings.toggleFileSearch.key]: props.toggleFileSearch,
    [props.keyBindings.toggleFileTree.key]: props.toggleFileTree,
  };

  return (
    <div className="container">
      <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
      {props.showFileTree ? (
        <div className="side-bar">
          <FileTree />
          <FileTreeActions />
        </div>
      ) : (
        <div />
      )}
      <div className="main-panel">
        <FileEditor />
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  showFileTree: state.settings.appSettings.showFileTree,
  keyBindings: state.settings.keyBindings,
});

const mapDispatchToProps = (dispatch: any) => ({
  toggleFileSearch: () => dispatch(ToggleFileSearch.create({})),
  toggleFileTree: () => dispatch(ToggleFileTree.create({})),
});

export const EditorApp = connect(mapStateToProps, mapDispatchToProps)(EditorAppComponent);
