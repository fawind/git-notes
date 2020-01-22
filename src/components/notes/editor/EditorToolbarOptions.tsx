import * as React from 'react';
import {FileEditStore} from '@src/store/fileEditStore';
import {inject} from '@src/appModule';
import {observer} from 'mobx-react';

type State = {
  dropdownVisible: boolean;
}

@observer
export class EditorToolbarOptions extends React.Component<{}, State> {
  @inject(FileEditStore) private fileEditStore: FileEditStore;

  constructor(props: {}) {
    super(props);
    this.state = {dropdownVisible: true};
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.onRevert = this.onRevert.bind(this);
  }

  toggleDropdown() {
    this.setState({dropdownVisible: !this.state.dropdownVisible});
  }

  onCommit() {
    this.fileEditStore.pushFile();
  }

  onRevert() {
    this.fileEditStore.revertFile();
  }

  renderDropdown(): JSX.Element {
    if (!this.state.dropdownVisible) {
      return <div/>;
    }
    return (
        <div>
          <div className="file-settings-dropdown">
            <div className="option" onClick={this.onCommit}>Commit and Push</div>
            <hr/>
            <div className="option" onClick={this.onRevert}>Revert Changes</div>
          </div>
          <div className="file-settings-dropdown-overlay" onClick={this.toggleDropdown}/>
        </div>
    );
  }

  render() {
    return (
        <div>
          <div className="file-settings-button" onClick={this.toggleDropdown}>{'•••'}</div>
          {this.renderDropdown()}
        </div>
    );
  }
}
