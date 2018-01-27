import { Action } from '@ngrx/store';

export const STATE_UPDATE = '[Uppy] State update';

export class StateUpdate implements Action {
  readonly type = STATE_UPDATE;

  constructor(public payload: {
    id: any;
    patch: any;
  }) {}
}

export type Actions = StateUpdate;
