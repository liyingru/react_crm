import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { updatePasswordCtrl} from './service';
export interface TableListParams {
}
export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    updatePasswordCtrl: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}
export interface StateType {
  configData: {},
}
const Model: ModelType = {
  namespace: 'changePassword',
  state: {
    configData: {},
  },
  effects: {
    // 任务配置
    *updatePasswordCtrl({ payload,callback }, { call }) {
      let response = yield call(updatePasswordCtrl, payload);
      if (callback) callback(response);
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
  },
};

export default Model;

