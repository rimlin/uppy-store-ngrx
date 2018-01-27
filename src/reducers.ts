import { UppyFiles, Meta } from './interfaces';
import * as StoreActions from './actions';

export interface State {
  plugins: object;
  files: UppyFiles<any>;
  currentUploads: object;
  capabilities: object;
  totalProgress: number;
  meta: Meta;
  info: object;
}

const initialState: State = {
  plugins: {},
  files: {},
  currentUploads: {},
  capabilities: {
    resumableUploads: false
  },
  totalProgress: 0,
  meta: {},
  info: {
    isHidden: true,
    type: 'info',
    message: ''
  }
};

export function reducer(state = initialState, action: StoreActions.Actions): State {
  if (action.type === StoreActions.STATE_UPDATE) {
    const newState = { ...state, ...action.payload.patch };

    return {
      ...state,
      ...newState
    };
  }

  return state;
}
