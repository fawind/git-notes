import { FilePathUtils, FileService } from "@src/services/fileService";
import { Dispatch } from "redoodle";
import { FileEntry, FileTreeItem, FileType } from "@src/store/types";
import {
  CollapseFileTreeItem,
  ExpandLoadedFileTreeItem,
  ExpandUnloadedFileTreeItem,
  OpenFile,
  SetFileTree,
} from "@src/store/actions";
import { AppState } from "@src/store/appState";

export const ReadFile = (file: FileEntry) => async (dispatch: Dispatch) => {
  const content = await FileService.readFile(file);
  dispatch(OpenFile.create({ file, content }));
};

export const WriteFile = (file: FileEntry, getContent: () => string) => async (
  dispatch: Dispatch
) => {
  await FileService.writeFile(file, getContent());
};

export const CreateFile = () => async (dispatch: any, getState: () => AppState) => {
  const currentFilePath = FilePathUtils.getParentDir(getState().currentFile?.file.path || "");
  let newFilePath = window.prompt(
    "Enter path to create a new file (directories end with '/')",
    currentFilePath
  );
  if (!newFilePath || newFilePath.length === 0) {
    return;
  }
  const isDir = newFilePath[newFilePath.length - 1] === "/";
  if (isDir) {
    newFilePath = newFilePath.slice(0, -1);
    await FileService.addDir(newFilePath);
  } else {
    await FileService.addFile(newFilePath, "");
  }
  dispatch(
    RefreshFileTreeDir({ path: FilePathUtils.getParentDir(newFilePath), type: FileType.DIRECTORY })
  );
};

export const InitFileTree = () => async (dispatch: Dispatch) => {
  const files: FileEntry[] = await FileService.listRoot();
  dispatch(SetFileTree.create({ files }));
};

export const ToggleFileTreeDir = (item: FileTreeItem) => async (dispatch: Dispatch) => {
  if (item.file.type !== FileType.DIRECTORY) {
    return;
  }
  if (item.isExpanded) {
    dispatch(CollapseFileTreeItem.create({ file: item.file }));
  } else if (item.children !== null) {
    dispatch(ExpandLoadedFileTreeItem.create({ file: item.file }));
  } else {
    const children = await FileService.listDir(item.file);
    dispatch(ExpandUnloadedFileTreeItem.create({ file: item.file, children }));
  }
};

export const RefreshFileTreeDir = (dir: FileEntry) => async (
  dispatch: Dispatch,
  getState: () => AppState
) => {
  const item = getState().fileTree[dir.path];
  if (!item) {
    return;
  }
  const children = await FileService.listDir(item.file);
  dispatch(ExpandUnloadedFileTreeItem.create({ file: item.file, children }));
};
