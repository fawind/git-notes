import { FilePathUtils, FileService } from "@src/services/fileService";
import { Dispatch } from "redoodle";
import { FileEntry, FileTreeItem, FileType } from "@src/store/types";
import {
  CloseFile,
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

export const WriteFile = (file: FileEntry, getContent: () => string) => async () => {
  await FileService.writeFile(file, getContent());
};

export const CreateFile = () => async (dispatch: any, getState: () => AppState) => {
  let newFilePath = requestFilePath(
    FilePathUtils.getParentDir(getState().currentFile?.file.path || ""),
    "Enter path to create a new file (directories end with '/')"
  );

  if (newFilePath.length === 0) {
    return;
  }

  if (newFilePath.endsWith("/")) {
    newFilePath = newFilePath.slice(0, -1);
    await FileService.addDir(newFilePath);
  } else {
    await FileService.addFile(newFilePath, "");
    dispatch(ReadFile({ path: newFilePath, type: FileType.FILE }));
  }

  dispatch(
    // TODO: Fix filetree when adding file to rood dir
    RefreshFileTreeDir({ path: FilePathUtils.getParentDir(newFilePath), type: FileType.DIRECTORY })
  );
};

export const DeleteFile = (file: FileEntry) => async (dispatch: any) => {
  if (file.type === FileType.FILE) {
    await FileService.removeFile(file);
  } else {
    await FileService.removeDir(file);
  }

  if (!confirm("Are you sure you want to delete the file?")) {
    return;
  }

  dispatch(CloseFile.create({}));

  dispatch(
    RefreshFileTreeDir({
      path: FilePathUtils.getParentDir(file.path),
      type: FileType.DIRECTORY,
    })
  );
};

export const MoveFile = (file: FileEntry) => async (dispatch: any) => {
  const newFilePath = requestFilePath(file.path, "Enter new path to move file");
  if (newFilePath.length === 0) {
    return;
  }
  await FileService.moveFile(file, newFilePath);

  dispatch(ReadFile({ path: newFilePath, type: file.type }));

  dispatch(
    RefreshFileTreeDir({
      path: FilePathUtils.getParentDir(file.path),
      type: FileType.DIRECTORY,
    })
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

const requestFilePath = (placeholder: string, message: string): string => {
  let newFilePath = window.prompt(message, placeholder);

  if (!newFilePath || newFilePath.length === 0) {
    return "";
  }

  if (newFilePath[0] !== "/") {
    newFilePath = "/" + newFilePath;
  }

  if (!newFilePath.endsWith("/") && !newFilePath.endsWith(".md")) {
    newFilePath = newFilePath + ".md";
  }

  return newFilePath;
};
