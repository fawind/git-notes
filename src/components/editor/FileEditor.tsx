import * as React from 'react';
import {ReactElement} from 'react';
import {inject, observer} from 'mobx-react';
import {FileEditStore} from '@src/store/fileEditStore';

type Props = {
  readonly fileEditStore?: FileEditStore;
}

export const FileEditor: React.FunctionComponent<Props> = inject('fileEditStore')(observer((props: Props): ReactElement => {
  if (props.fileEditStore!.file === null) {
    return <div/>;
  }
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.fileEditStore!.onChange(event.target.value);
  };
  return (
      <div style={{height: '100%'}}>
        <div><b>{props.fileEditStore!.file.name}</b></div>
        <textarea
            className="editor"
            onChange={onChange}
            value={props.fileEditStore!.content}
        />
      </div>
  );
}));
