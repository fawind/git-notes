import * as React from 'react';
import Editor from 'rich-markdown-editor';
import {getEditorTheme} from '@src/components/notes/editor/editorTheme';
import {FileEditStore} from '@src/store/fileEditStore';
import {SettingsStore} from '@src/store/settingsStore';
import {inject} from '@src/appModule';
import {observer} from 'mobx-react';

@observer
export class EditorContent extends React.PureComponent<{}> {
  @inject(FileEditStore) private fileEditStore: FileEditStore;
  @inject(SettingsStore) private settingsStore: SettingsStore;

  constructor(props: any) {
    super(props);
    this.onEditorChange = this.onEditorChange.bind(this);
  }

  private onEditorChange(getValue: () => string) {
    if (this.fileEditStore.currentFile) {
      this.fileEditStore.onChange(this.fileEditStore.currentFile.file, getValue);
    }
  }

  render() {
    return (
        <div className="editor-content">
          <Editor
              key={this.fileEditStore.currentFile!.file.path}
              id={this.fileEditStore.currentFile!.file.path}
              defaultValue={this.fileEditStore.currentFile!.content}
              onChange={this.onEditorChange}
              autoFocus={true}
              placeholder={'Start writing...'}
              theme={getEditorTheme(this.settingsStore.theme)}
          />
        </div>
    );
  }
}
