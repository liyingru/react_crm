import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  getQaRuleDetail
} from './service';
import { RulesDetail } from './data';

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
    getQaRuleDetail: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

export interface StateType {
  rulesDetail: RulesDetail | undefined,
}

const Model: ModelType = {
  namespace: 'qaRulesDetailModel',
  state: {
    rulesDetail: undefined
  },
  effects: {
    *getQaRuleDetail({ payload }, { call, put }) {
      let response = yield call(getQaRuleDetail, payload);
      yield put({
        type: 'save',
        payload: { rulesDetail: response.data.result },
      });
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

