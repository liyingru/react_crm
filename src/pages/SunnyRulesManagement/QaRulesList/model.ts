import { AnyAction, Reducer } from '@/pages/SunnyRulesManagement/QaRulesList/node_modules/redux';
import { EffectsCommandMap } from '@/pages/SunnyRulesManagement/QaRulesList/node_modules/dva';
import {
  getConfig, getList, updateRule
} from './service';
import { RulesListData, SimpleCompany } from './data';
import { ConfigList } from '@/pages/CustomerManagement/commondata';


export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getList: Effect;
    getConfig: Effect;
    updateRule: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

export interface StateType {
  data: RulesListData
  configData: ConfigList|undefined,
  userList: {user_id: string, name: string}[];
  companyList: SimpleCompany[];
}

const Model: ModelType = {
  namespace: 'qaRulesListModel',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    configData: undefined,
    userList:[],
    companyList: [],
  },
  effects: {
    *getList({ payload }, { call, put }) {
      if (payload == undefined) {
        payload = {}
      }
      payload.page = payload.page || 1
      payload.pageSize = payload.pageSize || 10
      const response = yield call(getList, payload);
      yield put({
        type: 'save',
        payload: {
          data: {
            list: response.data.result.rows,
            pagination: {
              total: response.data.result.total,
              pageSize: response.data.result.page_size || payload.pageSize,
              current: payload ? payload.page : 1,
            }
          }
        },
      });
    },
    *getConfig({ payload }, { call, put }) {
      const response = yield call(getConfig, payload);
      let arr = response.data.result
      yield put({
        type: 'save',
        payload: {
          configData: arr
        },
      })
    },
    *updateRule({ payload,callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      if (callback) callback(response.code == 200, response.msg);
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },

};

export default Model;

