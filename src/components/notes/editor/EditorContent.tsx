import * as React from "react";
import Editor from "rich-markdown-editor";
import { getEditorTheme } from "@src/components/notes/editor/editorTheme";
import { CurrentFile, FileEntry, ThemeSettings } from "@src/store/types";

interface Props {
  currentFile: CurrentFile | null;
  theme: ThemeSettings;
  onSave: (file: FileEntry, getContent: () => string) => void;
}

let saveTimeout = -1;

export const EditorContent: React.FC<Props> = (props: Props) => {
  const onEditorChange = (getValue: () => string) => {
    if (saveTimeout !== -1) {
      window.clearTimeout(saveTimeout);
    }
    saveTimeout = window.setTimeout(() => {
      const content = getValue();
      if (props.currentFile!.content !== content) {
        props.onSave(props.currentFile!.file, getValue);
      }
    });
  };

  return (
    <div className="editor-content">
      {props.currentFile ? (
        <Editor
          key={props.currentFile.file.path}
          id={props.currentFile.file.path}
          defaultValue={props.currentFile.content}
          onChange={onEditorChange}
          autoFocus={true}
          placeholder={"Start writing..."}
          theme={getEditorTheme(props.theme)}
        />
      ) : (
        <div />
      )}
    </div>
  );
};
