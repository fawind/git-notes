export const enum FileType {
  File = 'FILE',
  Directory = 'DIRECTORY',
}

export class FileEntry {
  public readonly path: string;
  public readonly type: FileType;

  constructor(path: string, type: FileType) {
    this.path = path;
    this.type = type;
  }

  isFile(): boolean {
    return this.type === FileType.File;
  }

  isDirectory(): boolean {
    return this.type === FileType.Directory;
  }
}
