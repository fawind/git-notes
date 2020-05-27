import { Dispatch } from "redux";
import { SetCloneSettings } from "@src/store/actions";
import { GitService } from "@src/services/gitService";
import { AppState } from "@src/store/appState";

export const Clone = (
  url: string,
  user: string | null,
  email: string | null,
  token: string | null,
  onSuccess: () => void
) => async (dispatch: Dispatch, getState: () => AppState) => {
  dispatch(SetCloneSettings({ url, user, email, token }));
  await GitService.clone(getState().settings.repo);
  onSuccess();
};

export const SyncChanges = () => async (dispatch: Dispatch, getState: () => AppState) => {
  const repo = getState().settings.repo;
  await GitService.addAll();
  await GitService.commit(repo);
  await GitService.pull(repo);
  await GitService.push(repo);
};
