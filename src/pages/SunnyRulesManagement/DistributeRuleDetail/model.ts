import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  getPublicRuleDetail, delPublicRules
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
    getPublicRuleDetail: Effect;
    delPublicRules: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

export interface StateType {
  rulesDetail: RulesDetail,
}

const Model: ModelType = {
  namespace: 'distributeRulesDetailModel',
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
    *getPublicRuleDetail({ payload }, { call, put }) {
      let response = yield call(getPublicRuleDetail, payload);
      yield put({
        type: 'save',
        payload: { rulesDetail: response.data.result },
      });
    },
    *delPublicRules({ payload, callback }, { call, put }) {
      let response = yield call(delPublicRules, payload);
      if (callback) callback(response.code == 200, response.msg);
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

