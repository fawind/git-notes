import * as React from "react";
import { CurrentFile } from "@src/store/types";

interface Props {
  currentFile: CurrentFile;
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

export const EditorToolbar: React.FC<Props> = (props: Props) => {
  return (
    <div className="editor-toolbar">
      <div>{getFileLocation(props.currentFile.file.path)}</div>
    </div>
  );
};
