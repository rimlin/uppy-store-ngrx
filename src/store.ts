import { Action, Store, select } from '@ngrx/store';
import { take, takeUntil, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { getPatch } from './utils';
import { UppyFiles, Meta } from './interfaces';
import { State } from './reducers';
import * as StoreActions from './actions';
import { UppyFile } from '../index';

const DEFAULT_STATE_ID = 'uppy';

// Pluck Uppy state from the Ngrx store in the default location.
const defaultSelector = id => state => state[id];

export interface NgrxStoreOptions<T, U> {
  store: any; // Store<T>
  id?: any;
  selector?: any;
}

export interface INgrxStore<T, U> {
  getStore(): Store<T>;
  getFiles(): Observable<UppyFiles<U>>;
}

/**
 * T - interface of root state;
 * U - interface of custom file;
 */
export class NgrxStore<T, U> implements INgrxStore<T, U> {
  _store: Store<T>;
  _id: any;
  _selector: any;

  constructor(opts: NgrxStoreOptions<T, U>) {
    this._store = opts.store;
    this._id = opts.id || DEFAULT_STATE_ID;
    this._selector = opts.selector || defaultSelector(this._id);

    // Initialise the `uppy[id]` state key.
    this.setState({});
  }

  setState(patch): void {
    this._store.dispatch(new StoreActions.StateUpdate({
      patch,
      id: this._id,
    }));
  }

  getState(): any {
    let state;
    this._store.pipe(select(this._selector), take(1)).subscribe(s => state = s);

    return state;
  }

  subscribe(cb): Function {
    const unsub$: Subject<boolean> = new Subject<boolean>();

    let prevState = this.getState();

    this._store.pipe(takeUntil(unsub$)).subscribe(nextState => {
      if (prevState !== nextState) {
        const patch = getPatch(prevState, nextState);
        cb(prevState, nextState, patch);
        prevState = nextState;
      }
    });

    return () => unsub$.next(true);
  }

  // Store<T>
  getStore(): any {
    return this._store.select(this._selector);
  }

  // Observable<UppyFiles<U>>
  getFiles(): any {
    return this.getStore().select((state: State) => state.files);
  }
}

export function createNgrxStore<T, U>(opts: NgrxStoreOptions<T, U>): NgrxStore<T, U> {
  return new NgrxStore<T, U>(opts);
}
