import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addRule, queryRule, removeRule, updateRule,updateReqLiteCtrl, getConfigRule,
  getUserPermissionListCtrl, getLeadStatusConfigRule, getDistributePeopleConifgRule, 
  getDistributeGroupConifgRule, leadsDistributeRule,getRequirementList,
  fetchQAList,fetchReqConfig } from './service';

import { TableListData, Statistical,ReqConfig } from './data';
import { routerRedux } from 'dva/router';
import { ConfigItem, ConfigData } from '@/pages/LeadsManagement/leadsDetails/data';

export interface StateType {
  data: TableListData;
  statist: Partial<Statistical>;
  customerConfig: ConfigData;
  leadStatusConfig: ConfigItem[];
  distributeGroupConifg: ConfigItem[];
  distributePeopleConifg: ConfigItem[];
  permission: Object;
  reqConfig: ReqConfig;
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
    details: Effect;
    customerDetails: Effect;
    getConfigInfo: Effect;
    getLeadStatusConfigInfo: Effect;
    getDistributeGroupConifgInfo: Effect;
    getDistributePeopleConifgInfo: Effect;
    leadsDistribute: Effect;
    newReq: Effect;
    getUserPermissionList:Effect;
    updateReqLiteCtrlReq:Effect;
    fetchReqConfig:Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'qaManagementList',
  state: {
    data: {
      list: [],
      pagination: {},
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
      requirementFollowTag:[],
      photoStyle: [],
      carBrand: [],
      hotelStar: [],
      customerFollowStatus: [],
      requirementFollowStatus:[],
      orderFollowStatus: [],
      leadsStatus: [],
      banquetType: [],
      task: [],
      source: [],
      category2: [],
      requirementPhase:[],
      weddingDateTag:[],
      isArrival:[],
    },
    leadStatusConfig: [],
    distributeGroupConifg: [],
    distributePeopleConifg: [],
    permission:{},
    statist:{},
    reqConfig:{
      phase:[],
      company:[],
      company_channel:[],
    }
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
    *updateReqLiteCtrlReq({ payload,callback }, { call, put }) {
      const response = yield call(updateReqLiteCtrl, payload);
      if(callback)callback(response)
     
    },

    *details({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload,
      });
      const customerId = payload.customerId;
      const leadId = payload.leadId;
      const saveParams = payload.saveParams;
      yield put(routerRedux.push({
        pathname: '/leads/leadsManagement/leadsDetails',
        state: {
          customerId: customerId,
          leadId: leadId,
          saveParams: saveParams,
        },
      }));
    },
    *customerDetails({ payload }, { call, put }) {
      yield put(routerRedux.push({
        pathname: '/demand/demandManagement/demandDetails',
        state: {
          ...payload
        },
      }));
    },
    *fetch({ payload }, { call, put }) {
      if (payload == undefined) {
        payload = {}
      }
      payload.page = payload.page || 1
      payload.pageSize = payload.pageSize || 20
      const response = yield call(fetchQAList, payload);
      let pagination = {
        total: response.data.result.total,
        pageSize: response.data.result.page_size || payload.pageSize,
        current: payload ? payload.page : 1,
      }
      let fetchData = {
        'list': response.data.result.rows,
        'pagination': pagination,
      };
      yield put({
        type: 'save',
        payload: {
          data: fetchData,
          statist: response.data.result.statistical
        }
      });
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
      let arr = response.data.result
      yield put({
        type: 'save',
        payload: {
          customerConfig: arr,
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
    *newReq({ payload }, { call, put }) {
      yield put(routerRedux.push( {
        pathname: '/demand/demandManagement/newCustomer',
        query: {
          fromTag: 'demand',
        }
      }));
    },

    *fetchReqConfig({ payload }, { call, put }){
      const response = yield call(fetchReqConfig, payload);
      yield put({
        type: 'save',
        payload: {
          reqConfig:response.data.result,
        },
      });
    } 
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
