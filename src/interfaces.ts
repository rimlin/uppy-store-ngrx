import { State } from './reducers';

export type UppyId = string;
export type FileId = string;
export type Meta = Object;
export type InfoType = 'info' | 'warning' | 'success' | 'error';

export enum FileType {
  IMAGE_JPEG = <any> 'image/jpeg',
}

export interface UppyFile<T> {
  data: File;
  extension: string;
  id: string;
  isRemote: boolean;
  meta: {
    name: string;
    type: FileType;
  };
  name: string;
  preview: string;
  progress: {
    percentage: number;
    bytesUploaded: number;
    bytesTotal: number;
    uploadComplete: boolean;
    uploadStarted: boolean;
  };
  remote: string;
  size: number;
  source: string;
  type: FileType;
  error?: string;
  uploadURL?: T;
}

export interface UppyFiles<T> {
  [key: string]: UppyFile<T>;
}

/**
 * T - interface of Uppy Store;
 * U - interface of custom file;
 */
export interface IUppy<T, U> {
  id: UppyId;
  autoProceed: boolean;
  debug: boolean;
  restrictions: {
    maxFileSize: boolean;
    maxNumberOfFiles: boolean;
    minNumberOfFiles: boolean;
    allowedFileTypes: boolean;
  };
  meta: Meta;
  locale: string;
  store: T;
  thumbnailGeneration: boolean;
  onBeforeFileAdded(currentFile: UppyFile<U>, files: UppyFiles<U>): Promise<any>;
  onBeforeUpload(files: UppyFiles<U>, done: boolean): Promise<any>;
  use(plugin: Object, opts: Object): void;
  run(): void;
  getId(): UppyId;
  addFile(fileObject: {
    name: string;
    type: FileType;
    data: File;
    source?: string;
    isRemote?: boolean;
  }): Promise<any>;
  removeFile(fileID: FileId): void;
  getFile(fileID: FileId): UppyFile<U>;
  setState(patch: any): void;
  getState(): State;
  setMeta(data: Meta): void;
  setFileMeta(fileID: FileId, data: Meta): void;
  reset(): void;
  close(): void;
  log(msgString: string): void;
  info(message: string, type: InfoType, duration: number): void;
  upload(): Promise<{
    successful: Array<UppyFile<U>>;
    failed: Array<UppyFile<U>>;
  }>;
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
}
