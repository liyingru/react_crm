import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  getConfig, getList, deleteRule,updateRule,getUserLsit, getRulesCompanyLsit
} from './service';
import { RulesListData, SimpleCompany } from './data';
import { ConfigListItem } from '@/pages/CustomerManagement/customerList/data';
import { ConfigList } from '@/pages/CustomerManagement/commondata';
import { SystemUser } from '@/pages/DashboardWorkplace/data';


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
    deleteRule: Effect;
    updateRule: Effect;
    getUserList: Effect;
    getRulesCompanyLsit: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

export interface StateType {
  data: RulesListData
  configData: ConfigList,
  userList: {user_id: string, name: string}[];
  companyList: SimpleCompany[];
}

const Model: ModelType = {
  namespace: 'sunnyRulesListModel',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    configData: {
      channel:[],
    },
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
    *deleteRule({ payload,callback }, { call, put }) {
      const response = yield call(deleteRule, payload);
      if (callback) callback(response.code == 200, response.msg);
    },
    *updateRule({ payload,callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      if (callback) callback(response.code == 200, response.msg);
    },
    *getUserList({ payload }, { call, put }) {
      const response = yield call(getUserLsit, payload);
      yield put({
        type: 'save',
        payload: {
          userList: response.data.result
        },
      })
    },
    *getRulesCompanyLsit({ payload }, { call, put }) {
      const response = yield call(getRulesCompanyLsit, payload);
      yield put({
        type: 'save',
        payload: {
          companyList: response.data.result
        },
      })
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

