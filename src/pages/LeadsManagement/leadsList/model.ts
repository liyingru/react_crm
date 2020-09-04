import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getUserPermissionListCtrl, updateReqLiteCtrl, addRule, queryRule, removeRule, updateRule, getConfigRule, getLeadStatusConfigRule, getDistributePeopleConifgRule, getDistributeGroupConifgRule, leadsDistributeRule } from './service';

import { TableListData } from './data';
import { routerRedux } from 'dva/router';
import { ConfigData, ConfigItem } from '../leadsDetails/data';

export interface StateType {
  data: TableListData;
  customerConfig: ConfigData;
  leadStatusConfig: ConfigItem[];
  distributeGroupConifg: ConfigItem[];
  distributePeopleConifg: ConfigItem[];
  permission: any;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
    newLeads: Effect;
    details: Effect;
    customerDetails: Effect;
    getConfigInfo: Effect;
    getLeadStatusConfigInfo: Effect;
    getDistributeGroupConifgInfo: Effect;
    getDistributePeopleConifgInfo: Effect;
    leadsDistribute: Effect;
    getUserPermissionList: Effect;
    updateReqLiteCtrlReq: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'leadManagementAndsearchAndLeadTableList',
  state: {
    data: {
      list: [],
      pagination: {},
      count: 0,
      color_status: "0"
    },
    customerConfig: {
      channel: [],
      customerLevel: [],
      leadsFollowStatus: [],
      flowStatus: [],
      identity: [],
      gender: [],
      weddingStyle: [],
      category: [],
      contactTime: [],
      contactWay: [],
      payType: [],
      requirementStatus: [],
      followTag: [],
      photoStyle: [],
      carBrand: [],
      hotelStar: [],
      customerFollowStatus: [],
      orderFollowStatus: [],
      leadsStatus: [],
      banquetType: [],
      task: [],
      source: [],
      validStatus: [],
      timeoutStatus: [],
    },
    leadStatusConfig: [],
    distributeGroupConifg: [],
    distributePeopleConifg: [],
    permission: {}
  },

  effects: {
    *getUserPermissionList({ payload }, { call, put }) {
      const response = yield call(getUserPermissionListCtrl, payload);
      yield put({
        type: 'save',
        payload: {
          permission: response.data.result
        },
      });
    },
    *updateReqLiteCtrlReq({ payload, callback }, { call, put }) {
      const response = yield call(updateReqLiteCtrl, payload);
      if (callback) callback(response)
    },
    *newLeads({ payload }, { call, put }) {
      yield put(routerRedux.push({
        pathname: '/leads/leadsManagement/newCustomer',
        query: {
          fromTag: 'leads',
        }
      }));
    },
    *details({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload,
      });
      const customerId = payload.customerId;
      const leadId = payload.leadId;
      const categoryId = payload.categoryId;
      const saveParams = payload.saveParams;
      const ownerId = payload.ownerId;
      yield put(routerRedux.push({
        pathname: '/leads/leadsManagement/leadsDetails',
        state: {
          customerId: customerId,
          leadId: leadId,
          categoryId: categoryId,
          saveParams: saveParams,
          ownerId: ownerId,
        },
      }));
    },
    *customerDetails({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload,
      });
      const customerId = payload.customerId;
      yield put(routerRedux.push({
        pathname: '/customer/customerManagement/customerDetail',
        state: {
          customerId: customerId,
        },
      }));
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      if (response.code == 200) {
        let pagination = {
          total: response.data.result.count,
          pageSize: response.data.result.page_size,
          current: payload ? payload.page : 1,
        }
        let fetchData = {
          'list': response.data.result.data,
          'pagination': pagination,
          'count': response.data.result.count,
          'color_status': response.data.result.color_status,
        };
        console.log(fetchData);
        yield put({
          type: 'save',
          payload: {
            data: fetchData,
          }
        });
      } else {
        let data = {
          list: [],
          pagination: {},
        }
        yield put({
          type: 'save',
          payload: {
            data: data,
          }
        });
      }

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
    *getConfigInfo({ payload }, { call, put }) {
      const response = yield call(getConfigRule, payload);
      yield put({
        type: 'save',
        payload: {
          customerConfig: response.data.result,
        }
      });
    },
    *getLeadStatusConfigInfo({ payload, callback }, { call, put }) {
      const response = yield call(getLeadStatusConfigRule, payload);
      yield put({
        type: 'save',
        payload: {
          leadStatusConfig: response.data.result,
        }
      });
      if (callback) callback(response);
    },
    *leadsDistribute({ payload, callback }, { call, put }) {
      const response = yield call(leadsDistributeRule, payload);
      yield put({
        type: 'save',
        payload,
      });
      if (callback) callback(response);
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
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default Model;
