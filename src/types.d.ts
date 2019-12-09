declare module '@isomorphic-git/lightning-fs';

interface Stat {
  type: 'file' | 'dir',
  mode: string,
  size: number,
  ino: number,
  mtimeMs: number,
  ctimeMs: number,
  uid: 1 | 0,
  gid: 1 | 0,
  dev: 1 | 0,
  isFile: () => boolean,
  isDirectory: () => boolean,
  isSymbolicLink: () => boolean,
}

type FileEncoding = 'utf8';

declare interface PromiseFS {
  mkdir: (filepath: string, options?: { mode?: string }) => Promise<void>,
  rmdir: (filepath: string) => Promise<void>,
  readdir: (filepath: string) => Promise<string[]>,
  writeFile: (filepath: string, data: string, options?: { mode?: string, encoding?: FileEncoding }) => Promise<void>,
  readFile: (filepath: string, options?: { encoding?: FileEncoding }) => Promise<string>,
  unlink: (filepath: string) => Promise<void>,
  rename: (oldFilepath: string, newFilepath: string) => Promise<void>,
  stat: (filepath: string) => Promise<Stat>,
  lstat: (filepath: string) => Promise<Stat>,
  symlink: (target: string, filepath: string) => Promise<void>,
  readlink: (filepath: string) => Promise<any>,
  backFile: (filepath: string) => Promise<any>,
}

declare module 'rich-markdown-editor' {
  export type SearchResult = {
    title: string,
    url: string,
  };

  export type Block =
      | 'heading1'
      | 'heading2'
      | 'heading3'
      | 'block-quote'
      | 'code'
      | 'horizontal-rule'
      | 'bulleted-list'
      | 'ordered-list'
      | 'todo-list'
      | 'image';

  export type Mark = 'bold' | 'italic' | 'deleted' | 'code' | 'link';

  export type HiddenToolbarButtons = {
    marks?: Mark[],
    blocks?: Block[],
  };

  export type Theme = {
    almostBlack: string,
    lightBlack: string,
    almostWhite: string,
    white: string,
    white10: string,
    black: string,
    black10: string,
    primary: string,
    greyLight: string,
    grey: string,
    greyMid: string,
    greyDark: string,

    fontFamily: string,
    fontWeight: number | string,
    link: string,
    placeholder: string,
    textSecondary: string,
    textLight: string,
    selected: string,

    background: string,
    text: string,

    toolbarBackground: string,
    toolbarInput: string,
    toolbarItem: string,

    blockToolbarBackground: string,
    blockToolbarTrigger: string,
    blockToolbarTriggerIcon: string,
    blockToolbarItem: string,

    quote: string,
    codeBackground?: string,
    codeBorder?: string,
    horizontalRule: string,

    hiddenToolbarButtons?: HiddenToolbarButtons,
  };

  export type Props = {
    id?: string;
    defaultValue?: string;
    placeholder?: string;
    readOnly?: boolean;
    autoFocus?: boolean;
    spellCheck?: boolean;
    toc?: boolean;
    plugins?: Object[]
    theme?: Theme;
    dark?: boolean;
    tooltip?: React.Component;
    headingOffset?: number;
    uploadImage?: (file: File) => void;
    onSave?: (done: { done: boolean }) => void
    onCancel?: () => void;
    onChange?: (getValue: () => string) => void;
    onImageUploadStart?: () => void;
    onImageUploadStop?: () => void;
    onSearchLink?: (term: string) => SearchResult[];
    onShowToast?: (message: string) => void;
    onClickLink?: (href: string) => void;
    onClickHashTag?: (tag: string) => void;
    getLinkComponent?: (node: any) => React.Component | undefined;
  }

  export default class Editor extends React.Component<Props, any> {
  }

  export const theme: Theme;
}
