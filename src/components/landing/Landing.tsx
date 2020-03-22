import * as React from 'react';
import {ChangeEvent} from 'react';
import {observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';
import {SettingsStore} from '@src/store/settingsStore';
import {FileTreeStore} from '@src/store/fileTreeStore';
import {GitService} from '@src/services/gitService';
import {inject} from '@src/appModule';

@observer
export class Landing extends React.PureComponent<RouteComponentProps> {
  @inject(SettingsStore) private settingsStore: SettingsStore;
  @inject(GitService) private gitService: GitService;
  @inject(FileTreeStore) private fileTreeStore: FileTreeStore;

  private onUrlChange = (e: ChangeEvent<HTMLInputElement>) => this.settingsStore.url = e.target.value;
  private onUserChange = (e: ChangeEvent<HTMLInputElement>) => this.settingsStore.user = e.target.value;
  private onTokenChange = (e: ChangeEvent<HTMLInputElement>) => this.settingsStore.token = e.target.value;

  constructor(props: RouteComponentProps) {
    super(props);
    this.onClone = this.onClone.bind(this);
  }

  private onClone() {
    if (this.settingsStore.url && this.settingsStore.user && this.settingsStore.token) {
      this.gitService.clone()
        .then(() => {
          this.settingsStore.hasRepo = true;
          this.settingsStore.save();
          this.fileTreeStore.init().then(() => this.props.history.push('/'));
        });
    }
  }

  render() {
    return (
      <div>
        <div>
          Url: <input type="text" value={this.settingsStore.url || ''}
                      onChange={this.onUrlChange}/>
        </div>
        <div>
          Username: <input type="text" value={this.settingsStore.user || ''}
                           onChange={this.onUserChange}/>
        </div>
        <div>
          Token: <input type="text" value={this.settingsStore.token || ''}
                        onChange={this.onTokenChange}/>
        </div>
        <button onClick={this.onClone}>Clone</button>
      </div>
    );
  }
}
