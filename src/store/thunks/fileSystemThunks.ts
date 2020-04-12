import { FileService } from "@src/services/fileService";
import { Dispatch } from "redoodle";
import { FileEntry, FileTreeItem, FileType } from "@src/store/types";
import {
  CollapseFileTreeItem,
  ExpandLoadedFileTreeItem,
  ExpandUnloadedFileTreeItem,
  OpenFile,
  SetFileTree,
} from "@src/store/actions";

export const ReadFile = (file: FileEntry) => async (dispatch: Dispatch) => {
  const content = await FileService.readFile(file);
  dispatch(OpenFile.create({ file, content }));
};

export const WriteFile = (file: FileEntry, getContent: () => string) => async (
  dispatch: Dispatch
) => {
  await FileService.writeFile(file, getContent());
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
