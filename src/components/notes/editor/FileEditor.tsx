import * as React from 'react';
import {ReactElement} from 'react';
import {inject, observer} from 'mobx-react';
import {FileEditStore} from '@src/store/fileEditStore';
import Editor from 'rich-markdown-editor';

type Props = {
  readonly fileEditStore?: FileEditStore;
}

export const FileEditor: React.FunctionComponent<Props> = inject('fileEditStore')(observer((props: Props): ReactElement => {
  if (props.fileEditStore!.currentFile === null) {
    return <div/>;
  }
  const onChange = (getValue: () => string) => {
    if (props.fileEditStore!.currentFile !== null) {
      props.fileEditStore!.onChange(props.fileEditStore!.currentFile.file, getValue);
    }
  };
  return (
      <div style={{height: '100%'}}>
        <div><b>{props.fileEditStore!.currentFile.file.name}</b></div>
        <Editor
            key={props.fileEditStore!.currentFile.file.path}
            id={props.fileEditStore!.currentFile.file.path}
            defaultValue={props.fileEditStore!.currentFile.content}
            onChange={onChange}
            autoFocus={true}
            placeholder={'Start writing...'}
        />
      </div>
  );
}));
