import { FileEntry, FileSearchResult, FileSearchTarget } from "@src/store/types";
import * as fuzzysort from "fuzzysort";
import { GitService } from "@src/services/gitService";

const HIGHLIGHT_OPEN = `<span class="match">`;
const HIGHLIGHT_CLOSE = "</span>";

export class FileSearchSelector {
  constructor(private fileSearchTargets: FileSearchTarget[]) {}

  getFiles(query: string): FileSearchResult[] {
    return fuzzysort
      .go(query, this.fileSearchTargets, { key: "preparedTarget", limit: 10 })
      .map((result) => {
        const highlighted =
          fuzzysort.highlight(result, HIGHLIGHT_OPEN, HIGHLIGHT_CLOSE) || result.obj.file.path;
        return { file: result.obj.file, title: highlighted };
      });
  }
}

export const loadFileSearchSelector = async (): Promise<FileSearchSelector> => {
  const files: FileEntry[] = await GitService.listFiles();
  const fileSearchTargets: FileSearchTarget[] = files.map((file) => ({
    file,
    preparedTarget: fuzzysort.prepare(file.path),
  }));
  return new FileSearchSelector(fileSearchTargets);
};
