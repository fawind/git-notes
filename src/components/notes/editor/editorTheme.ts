import { theme as baseTheme, Theme } from "rich-markdown-editor";
import { ThemeSettings } from "@src/store/types";

export const getEditorTheme = (theme: ThemeSettings): Theme => ({
  ...baseTheme,
  fontFamily: "inherit",
  background: theme.bg,
  text: theme.fg,
  link: theme.link,

  quote: theme.fgLight,
  codeBackground: theme.bgLight,
  horizontalRule: theme.fgLight,
});
