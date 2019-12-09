import * as React from 'react';
import {ChangeEvent, ReactElement} from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';
import {SettingsStore} from '@src/store/settingsStore';
import {FileTreeStore} from '@src/store/fileTreeStore';
import {GitService} from '@src/services/gitService';

interface Props extends RouteComponentProps {
  readonly settingsStore: SettingsStore,
  readonly fileTreeStore: FileTreeStore,
  readonly gitService: GitService,
}

export const Landing: React.FunctionComponent<Props> = inject('settingsStore', 'fileTreeStore', 'gitService')
(observer((props: Props): ReactElement => {
  const onUrlChange = (e: ChangeEvent<HTMLInputElement>) => props.settingsStore.url = e.target.value;
  const onUserChange = (e: ChangeEvent<HTMLInputElement>) => props.settingsStore.user = e.target.value;
  const onTokenChange = (e: ChangeEvent<HTMLInputElement>) => props.settingsStore.token = e.target.value;
  const onClone = () => {
    if (props.settingsStore.url && props.settingsStore.user && props.settingsStore.token) {
      props.gitService.clone(props.settingsStore.url, props.settingsStore.user, props.settingsStore.token)
          .then(() => {
            props.settingsStore.hasRepo = true;
            props.settingsStore.save();
            props.fileTreeStore.init().then(() => props.history.push('/'));
          });
    }
  };
  return (
      <div>
        <div>
          Url: <input type="text" value={props.settingsStore.url || ''} onChange={onUrlChange}/>
        </div>
        <div>
          Username: <input type="text" value={props.settingsStore.user || ''}
                           onChange={onUserChange}/>
        </div>
        <div>
          Token: <input type="text" value={props.settingsStore.token || ''}
                        onChange={onTokenChange}/>
        </div>
        <button onClick={onClone}>Clone</button>
      </div>
  );
}));
