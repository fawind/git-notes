export const enum FileType {
  File = 'FILE',
  Directory = 'DIRECTORY',
}

export class FileEntry {
  public readonly path: string;
  public readonly type: FileType;
  public readonly name: string;

  constructor(path: string, type: FileType) {
    this.path = path;
    this.type = type;
    this.name = FileEntry.getName(path, this.type === FileType.File);
  }

  isFile(): boolean {
    return this.type === FileType.File;
  }

  isDirectory(): boolean {
    return this.type === FileType.Directory;
  }

  private static getName(path: string, isFile: boolean): string {
    const parts = path.split('/');
    const name = parts.length <= 1 ? path : parts[parts.length - 1];
    return isFile ? name : name + '/';
  }
}
