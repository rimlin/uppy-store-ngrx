## Uppy Store for Ngrx usage
[![npm](https://img.shields.io/npm/l/uppy-store-ngrx.svg?maxAge=2592000)]()
[![npm version](https://badge.fury.io/js/uppy-store-ngrx.svg)](https://badge.fury.io/js/uppy-store-ngrx)

Produce opportunity to use Ngrx state as a state of Uppy Store. Also package provides interfaces to convenient work Uppy with TypeScript.

### Installation
```
$ npm install uppy-store-ngrx --save
```

### Usages

1. Connect UppyStoreNgrx to your reducers. In this example for state name of Uppy store uses default value `uppy`. 

*reducers.ts*
```
import {
  ...
  ActionReducerMap,
} from '@ngrx/store';

import * as UppyStoreNgrx from 'uppy-store-ngrx';

export interface State {
  ...
  uppy: UppyStoreNgrx.State;
}

export const reducers: ActionReducerMap<State> = {
  ...
  uppy: UppyStoreNgrx.reducer
};
```

2. Connect UppyStoreNgrx to your Uppy instance:

*uploader.service.ts*
```
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as Uppy from 'uppy/lib/core/Core';
import { Observable } from 'rxjs/Observable';
import { createNgrxStore, INgrxStore, IUppy, UppyFile, UppyFiles, FileType } from 'uppy-store-ngrx';

import * as fromRoot from './reducers';

export interface MyFile {
  id: number;
  name: string;
  type: FileType;
}

@Injectable()
export class UploaderService {
  private uppy: IUppy<INgrxStore<fromRoot.State, MyFile>, MyFile>;
  
  constructor(
    private store: Store<fromRoot.State>
  ) {
    this.uppy = Uppy({
      store: createNgrxStore<fromRoot.State, MyFile>({
        store: this.store,
      }),
    });
  }

  // Async method to get files from Uppy state
  getFilesStream(): Observable<Array<UppyFile<MyFile>>> {
    return this.uppy.store.getFiles().map(files => (<any> Object).values(files));
  }

  // Sync method to get files from Uppy state
  getFiles(): Array<UppyFile<MyFile>> {
    let files: Array<UppyFile<MyFile>> = [];
    this.getFilesStream().take(1).subscribe(_files => files = _files);

    return files;
  }
}

```

Function `createNgrxStore` supports next options:
``` 
store: Store<T>; // Ngrx store.
id?: any; // Name of Uppy store in Ngrx state. Default name is `uppy`.
selector?: any; // Selector to select Uppy store from Ngrx state.
```