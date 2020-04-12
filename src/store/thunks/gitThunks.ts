import { Dispatch } from "redux";
import { SetCloneSettings } from "@src/store/actions";
import { GitService } from "@src/services/gitService";
import { AppState } from "@src/store/appState";
import { FileService } from "@src/services/fileService";

export const Clone = (
  url: string,
  user: string | null,
  token: string | null,
  onSuccess: () => void
) => async (dispatch: Dispatch, getState: () => AppState) => {
  dispatch(SetCloneSettings({ url, user, token }));
  await GitService.clone(getState().settings.repo);
  onSuccess();
};
