import * as React from "react";
import { useState } from "react";
import { FileEntry } from "@src/store/types";

interface Props {
  currentFile: FileEntry;
  deleteFile: (file: FileEntry) => void;
  moveFile: (file: FileEntry) => void;
}

export const EditorToolbarOptions: React.FC<Props> = (props: Props) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const onDelete = () => {
    props.deleteFile(props.currentFile);
    setDropdownVisible(false);
  };
  const onMove = () => {
    props.moveFile(props.currentFile);
    setDropdownVisible(false);
  };
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const renderDropdown = () => (
    <div>
      <div className="file-settings-dropdown">
        <div className="option" onClick={onMove}>
          Move file
        </div>
        <hr />
        <div className="option" onClick={onDelete}>
          Delete file
        </div>
      </div>
      <div className="file-settings-dropdown-overlay" onClick={toggleDropdown} />
    </div>
  );

  return (
    <div>
      <div className="file-settings-button" onClick={toggleDropdown}>
        {"•••"}
      </div>
      {dropdownVisible ? renderDropdown() : <div />}
    </div>
  );
};
