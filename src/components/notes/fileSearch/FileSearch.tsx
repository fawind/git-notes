import * as React from "react";
import { ChangeEvent } from "react";
import { FileEntry, FileSearchResult } from "@src/store/types";
import {
  FileSearchSelector,
  loadFileSearchSelector,
} from "@src/store/selectors/fileSearchSelector";
import { ReadFile } from "@src/store/thunks/fileSystemThunks";
import { connect } from "react-redux";
import "./fileSearch.css";
import { ToggleFileSearch } from "@src/store/actions";
import { AppState } from "@src/store/appState";

interface Props {
  isVisible: boolean;
  loadFileSearchSelector: () => Promise<FileSearchSelector>;
  openFile: (file: FileEntry) => void;
  toggleFileSearch: () => void;
}

interface State {
  input: string;
  fileSearchSelector: FileSearchSelector | null;
  results: FileSearchResult[];
  selectedIndex: number;
}

interface ResultProps {
  result: FileSearchResult;
  isSelected: boolean;
  openFile: (file: FileEntry) => void;
}

const FileSearchResult: React.FC<ResultProps> = (props: ResultProps) => {
  const onClick = () => props.openFile(props.result.file);
  const selectedClass = props.isSelected ? "selected" : "";
  return (
    <div
      key={props.result.file.path}
      className={`result-item ${selectedClass}`}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: props.result.title }}
    />
  );
};

class FileSearchComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { input: "", fileSearchSelector: null, results: [], selectedIndex: 0 };
    this.onSearchChange = this.onSearchChange.bind(this);
    this.getResults = this.getResults.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    this.props
      .loadFileSearchSelector()
      .then((fileSearchSelector) => this.setState({ fileSearchSelector }));
  }

  getResults(): FileSearchResult[] {
    if (!this.state.fileSearchSelector || this.state.input.trim() === "") {
      return [];
    }
    return this.state.fileSearchSelector.getFiles(this.state.input);
  }

  onSearchChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ input: event.target.value, results: this.getResults() });
  }

  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      if (this.state.results.length > 0) {
        const selectedResult = this.state.results[this.state.selectedIndex];
        this.props.openFile(selectedResult.file);
        this.props.toggleFileSearch();
      }
    } else if (event.key === "ArrowDown") {
      const newIndex = (this.state.selectedIndex + 1) % this.state.results.length;
      this.setState({ selectedIndex: newIndex });
    } else if (event.key === "ArrowUp") {
      const newIndex =
        this.state.selectedIndex === 0
          ? this.state.results.length - 1
          : this.state.selectedIndex - 1;
      this.setState({ selectedIndex: newIndex });
    }
  }

  renderResults() {
    return this.getResults().map((result, index) => {
      const isSelected = index === this.state.selectedIndex;
      return (
        <FileSearchResult
          key={result.file.path}
          result={result}
          openFile={this.props.openFile}
          isSelected={isSelected}
        />
      );
    });
  }

  render() {
    if (!this.props.isVisible) {
      return <div />;
    }
    return (
      <div className="file-search">
        <input
          type="text"
          placeholder="Search notes"
          onChange={this.onSearchChange}
          onKeyDown={this.onKeyDown}
          autoFocus={true}
        />
        <div className="result-list">{this.renderResults()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  isVisible: state.gui.fileSearchVisible,
});

const mapDispatchToProps = (dispatch: any) => ({
  loadFileSearchSelector: loadFileSearchSelector,
  openFile: (file: FileEntry) => dispatch(ReadFile(file)),
  toggleFileSearch: () => dispatch(ToggleFileSearch.create({})),
});

export const FileSearch = connect(mapStateToProps, mapDispatchToProps)(FileSearchComponent);
