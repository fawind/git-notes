import * as React from 'react';
import {ReactElement} from 'react';
import {inject, observer} from 'mobx-react';
import {FileEditStore} from '@src/store/fileEditStore';
import Editor from 'rich-markdown-editor';
import {getEditorTheme} from '@src/components/notes/editor/editorTheme';
import {SettingsStore} from '@src/store/settingsStore';

type Props = {
  readonly fileEditStore?: FileEditStore;
  readonly settingsStore?: SettingsStore;
}

export const EditorContent: React.FunctionComponent<Props> = inject('fileEditStore', 'settingsStore')
(observer((props: Props): ReactElement => {
  const onChange = (getValue: () => string) => {
    if (props.fileEditStore!.currentFile !== null) {
      props.fileEditStore!.onChange(props.fileEditStore!.currentFile.file, getValue);
    }
  };
  return (
      <div className="editor-content">
        <Editor
            key={props.fileEditStore!.currentFile!.file.path}
            id={props.fileEditStore!.currentFile!.file.path}
            defaultValue={props.fileEditStore!.currentFile!.content}
            onChange={onChange}
            autoFocus={true}
            placeholder={'Start writing...'}
            theme={getEditorTheme(props.settingsStore!.theme)}
        />
      </div>
  );
}));
