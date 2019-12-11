import * as React from 'react';

import './editor.css';
import {EditorContent} from '@src/components/notes/editor/EditorContent';
import {EditorToolbar} from '@src/components/notes/editor/EditorToolbar';
import {FileEditStore} from '@src/store/fileEditStore';
import {inject} from '@src/appModule';
import {observer} from 'mobx-react';

@observer
export class FileEditor extends React.PureComponent<{}> {
  @inject(FileEditStore) private fileEditStore: FileEditStore;

  render() {
    if (!this.fileEditStore.currentFile) {
      return <div/>;
    }
    return (
        <div className="editor">
          <EditorToolbar/>
          <EditorContent/>
        </div>
    );
  }
}
