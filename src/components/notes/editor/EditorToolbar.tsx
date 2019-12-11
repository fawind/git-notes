import * as React from 'react';
import {FileEditStore} from '@src/store/fileEditStore';
import {inject} from '@src/appModule';
import {observer} from 'mobx-react';

@observer
export class EditorToolbar extends React.PureComponent<{}> {
  @inject(FileEditStore) private fileEditStore: FileEditStore;

  private getLocationElements(path: string): JSX.Element[] {
    const elements: JSX.Element[] = [];
    const parts = path.split('/');
    parts.forEach((part, i) => {
      if (part === '') return;
      elements.push(<span key={i}>{part}</span>);
      if (i < parts.length - 1) {
        elements.push(<span key={`${i}-div`} className="path-divider">›</span>);
      }
    });
    return elements;
  }

  render() {
    return (
        <div className="editor-toolbar">
          <div>
            {this.getLocationElements(this.fileEditStore.currentFile!.file.path)}
          </div>
          <div>
            Settings
          </div>
        </div>
    );
  }
}
