import {AppTheme} from '@src/store/settingsStore';
import {theme as baseTheme, Theme} from 'rich-markdown-editor';

export const getEditorTheme = (theme: AppTheme): Theme => ({
  ...baseTheme,
  fontFamily: 'inherit',
  background: theme.bg,
  text: theme.fg,
  link: theme.link,

  quote: theme.fgLight,
  codeBackground: theme.bgLight,
  horizontalRule: theme.fgLight,
});
