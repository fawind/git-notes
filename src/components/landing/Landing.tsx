import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ChangeEvent, useState } from "react";
import { RepoSettings } from "@src/store/types";
import { AppState } from "@src/store/appState";
import { connect } from "react-redux";
import { Clone } from "@src/store/thunks/gitThunks";
import { Dispatch } from "redux";

interface Props extends RouteComponentProps {
  repo: RepoSettings;
  onClone: (
    url: string,
    user: string | null,
    email: string | null,
    token: string | null,
    onSuccess: () => void
  ) => void;
}

const LandingComponent: React.FC<Props> = (props: Props) => {
  const [url, setUrl] = useState(props.repo.url || "");
  const [user, setUser] = useState(props.repo.user || "");
  const [email, setEmail] = useState(props.repo.email || "");
  const [token, setToken] = useState(props.repo.token || "");
  const onUrlChange = (e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value);
  const onUserChange = (e: ChangeEvent<HTMLInputElement>) => setUser(e.target.value);
  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const onTokenChange = (e: ChangeEvent<HTMLInputElement>) => setToken(e.target.value);
  const onSubmit = () => {
    if (url === "") {
      return;
    }
    props.onClone(url, user || null, email || null, token || null, () => props.history.push("/"));
  };

  return (
    <div>
      <div>
        Url: <input type="text" value={url} onChange={onUrlChange} />
      </div>
      <div>
        Username: <input type="text" value={user} onChange={onUserChange} />
      </div>
      <div>
        Email: <input type="text" value={email} onChange={onEmailChange} />
      </div>
      <div>
        Token: <input type="text" value={token} onChange={onTokenChange} />
      </div>
      <button onClick={onSubmit}>Clone</button>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  repo: state.settings.repo,
});

const mapDispatchToProps = (dispatch: any) => ({
  onClone: (
    url: string,
    user: string | null,
    email: string | null,
    token: string | null,
    onSuccess: () => void
  ) => dispatch(Clone(url, user, email, token, onSuccess)),
});

export const Landing = connect(mapStateToProps, mapDispatchToProps)(LandingComponent);
