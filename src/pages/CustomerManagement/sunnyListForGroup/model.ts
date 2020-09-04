import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { groupRecordCustomerList, getCustomerConfig, getCustomerFields,getMessageConfig,getUserPermissionList,batchUpdateCustomer,queryUsersList} from './service';

import { CustomerField } from './data';
import { routerRedux } from 'dva/router';
import { ConfigList } from '../commondata';
import { Permission } from '@/commondata';
import { getDistributePeopleConifgRule } from '@/pages/DemandManagement/demandList/service';
import { ConfigItem } from '@/pages/LeadsManagement/leadsDetails/data';
import { CustomerListData } from '../sunnyList/data';

export interface StateType {
  data: CustomerListData | undefined;
  config: ConfigList | undefined;
  fields: CustomerField[];
  permission: Permission | {};
  roleData:any;
  distributePeopleConifg: ConfigItem[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  temp: any;
  state: StateType;
  effects: {
    fetch: Effect;
    config: Effect;
    fields: Effect;
    router: Effect;
    startDuplicateCustomer: Effect;
    getMessageConfigHandel:Effect;
    getUserPermissionList: Effect;
    batchUpdateCustomer:Effect;
    fetchRole:Effect;
    getDistributePeopleConifgInfo: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'sunnyListGroupModel',

  temp: {},

  state: {
    data: undefined,
    config: undefined,
    fields: [],
    messageConfig:[],
    permission: {},
    roleData:[]
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      if (payload == undefined) {
        payload = {}
      }
      payload.page = payload.page || 1
      payload.pageSize = payload.pageSize || 20
      const response = yield call(groupRecordCustomerList, payload);
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
    *config({ payload }, { call, put }) {
      const response = yield call(getCustomerConfig, payload);
      let arr = response.data.result
      arr.requirementFollowTag.unshift({ id: '', name: '全部' })
      yield put({
        type: 'save',
        payload: {
          config: arr
        },
      })
    },
    //客户重复，发起重单
    *startDuplicateCustomer({ payload }, { call, put }) {
      yield put(routerRedux.push({
        pathname: '/customer/customerManagement/startDuplicateCustomer',
        state: {
          customerData: undefined,
        },
      }));
    },

    *fields({ params }, { call, put }) {
      const response = yield call(getCustomerFields, params);
      yield put({
        type: 'save',
        payload: {
          fields: response.data.result
        },
      })
    },

    *getMessageConfigHandel({ payload }, { call, put }) {
      const response = yield call(getMessageConfig, payload);
      yield put({
        type: 'save',
        payload: {
          messageConfig: response.data.result
        },
      })
    },

    *getUserPermissionList({ payload }, { call, put }) {
      const response = yield call(getUserPermissionList, payload);
      yield put({
        type: 'save',
        payload: {
          permission: response.data.result
        },
      });
    },

    *batchUpdateCustomer({ payload, callback }, { call, put }) {
      const response = yield call(batchUpdateCustomer, payload);
      if(callback) callback(response.code == 200, response.msg);
    },

    *router({ payload }, { call, put }) {
      yield put(routerRedux.push({
        pathname: payload.pathname,
        state: {
          ...payload.params
        },
      }));
    },
    *fetchRole({ payload }, { call, put }) {
      const response = yield call(queryUsersList, payload);
      if(response.code == 200) {
        yield put({
          type: 'save',
          payload:{
            roleData:response.data.result.rows
          }
        })
      }
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
