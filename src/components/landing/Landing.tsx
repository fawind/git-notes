import * as React from 'react';
import {ChangeEvent, ReactElement} from 'react';
import {inject, observer} from 'mobx-react';
import {RepoStore} from '@src/store/repoStore';
import {FileStore} from '@src/store/fileStore';
import {GitService} from '@src/services/gitService';

type Props = {
  readonly repoStore: RepoStore;
  readonly fileStore: FileStore;
  readonly gitService: GitService;
}

export const Landing: React.FunctionComponent<Props> = inject('repoStore', 'fileStore', 'gitService')
(observer((props: Props): ReactElement => {
  const onUrlChange = (e: ChangeEvent<HTMLInputElement>) => props.repoStore.url = e.target.value;
  const onUserChange = (e: ChangeEvent<HTMLInputElement>) => props.repoStore.user = e.target.value;
  const onTokenChange = (e: ChangeEvent<HTMLInputElement>) => props.repoStore.token = e.target.value;
  const onClone = () => {
    if (props.repoStore.url && props.repoStore.user && props.repoStore.token) {
      props.gitService.clone(props.repoStore.url, props.repoStore.user, props.repoStore.token);
    }
  };
  return (
      <div>
        <div>
          Url: <input type="text" value={props.repoStore.url || ''} onChange={onUrlChange}/>
        </div>
        <div>
          Username: <input type="text" value={props.repoStore.user || ''} onChange={onUserChange}/>
        </div>
        <div>
          Token: <input type="text" value={props.repoStore.token || ''} onChange={onTokenChange}/>
        </div>
        <button onClick={onClone}>Clone</button>
      </div>
  );
}));
