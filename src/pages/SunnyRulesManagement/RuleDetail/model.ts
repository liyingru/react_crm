import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  getRulesDetail
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
    getRulesDetail: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

export interface StateType {
  rulesDetail: RulesDetail,
}

const Model: ModelType = {
  namespace: 'sunnyRulesDetailModel',
  state: {
    rulesDetail: {
      rulesInfo: {},
      intoGroupData: [],
      verifierData: {},
      inviteData: {},
      orderData: {},
      logRules: [],
    },
  },
  effects: {
    // 任务配置
    *getRulesDetail({ payload }, { call, put }) {
      let response = yield call(getRulesDetail, payload);
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

