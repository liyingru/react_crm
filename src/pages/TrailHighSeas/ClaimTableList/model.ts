import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addRule, queryRule,
   removeRule, updateRule, leadsConfig, 
   leadsClaim, listRole, groupList,
   leadsDistribute, 
   getDistributePeopleConifgRule,
   getDistributeGroupConifgRule,
   getCustomerByNameCtrl,
   getUserPermissionList
  } from './service';

import { TableListData, ClaimData } from './data';
import { ConfigItem } from '@/pages/LeadsManagement/leadsDetails/data';

export interface StateType {
  data: TableListData;
  configData: {
    business: [],
    channel: [],
    followRes: [],
    weddingStyle: [],
    category: [],
  };
  claimResult: string;
  reson: string;
  roleData: [],
  groupData: {
    total:number,
    rows: [],
  },
  distributeGroupConifg: ConfigItem[];
  distributePeopleConifg: ConfigItem[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    leadsConfig: Effect;
    fetch: Effect;
    leadsClaim: Effect;
    getListRole: Effect;
    getGroupList: Effect;
    leadsDistribute: Effect;
    getUserPermissionList: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
    getDistributeGroupConifgInfo: Effect;
    getDistributePeopleConifgInfo: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'trailHighSeasTableList',

  state: {
    data: {
      list: [],
      pagination: {},
      header:[],
    },
    configData: {
      business: [],
      channel: [],
      followRes: [],
      weddingStyle: [],
      category: [],
    },
    claimResult: '',
    reson: '',
    roleData:[],
    groupData: {
      total: 0,
      rows: [],
    },
    distributeGroupConifg: [],
    distributePeopleConifg: [],
  },

  effects: {
    *leadsConfig({ payload }, { call, put }) {
      const response = yield call(leadsConfig, payload);
      yield put({
        type: 'save',
        payload: {
          configData: response.data.result
        },
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      if(response.code == 200){
        console.log(response.code)
        let pagination = {
          total: response.data.result.count,
          pageSize: response.data.result.page_size,
          current: payload ? payload.page : 1,
        }
        let data = {
          'count': response.data.result.count,
          'list': response.data.result.data,
          'pagination': pagination,
          'header':response.data.result.header,
        };
        yield put({
          type: 'save',
          payload: {
            data: data,
          },
        });
      }else{
        let data= {
          count: 0,
          list: [],
          pagination: {},
          header:[],
        }
        yield put({
          type: 'save',
          payload: {
            data: data,
          },
        });
      }
    },

    *leadsClaim({ payload }, { call, put }) {
      const response = yield call(leadsClaim, payload);
      yield put({
        type: 'save',
        payload: {
          claimResult: response.data.result,
          reson: response.msg,
        },
      });
    },
    *getListRole({ payload }, { call, put }) {
      const response = yield call(listRole, payload);
      yield put({
        type: 'save',
        payload: {
          roleData : response.data.result,
        },
      });
    },

    *getGroupList({ payload }, { call, put }) {
      const response = yield call(groupList, payload);
      yield put({
        type: 'save',
        payload: {
          groupData :{
            rows: response.data.result.rows,
            total: response.data.result.total,
          },
        },
      });
    },

    *leadsDistribute({ payload, callback }, { call, put }) {
      const response = yield call(leadsDistribute, payload);
      yield put({
        type: 'save',
        payload,
      });
      if (callback) callback(response);
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *getDistributeGroupConifgInfo({ payload }, { call, put }) {
      const response = yield call(getDistributeGroupConifgRule, payload);
      yield put({
        type: 'save',
        payload: {
          distributeGroupConifg: response.data.result,
        }
      });
    },
    *getDistributePeopleConifgInfo({ payload }, { call, put }) {
      const response = yield call(getDistributePeopleConifgRule, payload);
      yield put({
        type: 'save',
        payload: {
          distributePeopleConifg: response.data.result,
        }
      });
    },
    *getUserPermissionList({ payload ,callback}, { call, put }) {
      const response = yield call(getUserPermissionList, payload);
      if (callback) callback(response);
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
