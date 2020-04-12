import * as React from "react";
import { FileTree } from "@src/components/notes/fileTree/FileTree";
import { FileEditor } from "@src/components/notes/editor/FileEditor";

export const EditorApp: React.FC = () => (
  <div className="container">
    <div className="side-bar">
      <FileTree />
    </div>
    <div className="main-panel">
      <FileEditor />
    </div>
  </div>
);
