export const enum FileType {
  File = 'FILE',
  Directory = 'DIRECTORY',
}

export const getPath = (path: string): string => {
  if (path.length > 0 && path[0] === '/') {
    return path;
  }
  return '/' + path;
};

export class FileEntry {
  public readonly path: string;
  public readonly type: FileType;
  public readonly name: string;

  static file(path: string): FileEntry {
    return new FileEntry(path, FileType.File);
  }

  static dir(path: string): FileEntry {
    return new FileEntry(path, FileType.Directory);
  }

  constructor(path: string, type: FileType) {
    this.path = getPath(path);
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

export const ROOT_DIR = FileEntry.dir('/');
