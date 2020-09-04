import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getCustomerComplaintDetail, fetchFollowList, updateCustomerInfo,updateContactInfo, createContactInfo, getConfigRule, handleCustomerComplaint } from './service';
import {getCustomerDetail} from '../../CustomerManagement/customerDetail/dxl/service'
import {CustomerDetail} from '../../CustomerManagement/customerDetail/dxl/data'

import { CustomerComplaintDetail, CustomerComplaintFollowListResponseResult, CustomerComplaintFollowData, TableListPagination } from '../data';
import { ConfigList } from '@/pages/CustomerManagement/commondata';
import { stringify } from 'qs';
import { routerRedux } from 'dva/router';

export interface StateType {
  customerComplaintDetail: CustomerComplaintDetail|undefined;
  followList: {list: CustomerComplaintFollowData[]; pagination: TableListPagination}
  customerDetail: CustomerDetail;
  config: ConfigList | undefined;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchComplaintDetail: Effect;
    submitDealWith: Effect;
    fetchFollowList: Effect;
    fetchCustomerDetail: Effect;
    updateCustomerInfo: Effect;
    updateContactInfo: Effect;
    createContactInfo: Effect;
    getConfigInfo: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'customerComplaintDetailModel',
  state: {
    customerComplaintDetail: undefined,
    customerDetail: {
      customerData: {},
      requirementData: {
        my: [],
        other: []
      },
      contactUserData: [],
      followData: [],
      reqTeamData: [],
      contractData:{
         total:0,
         rows:[],
      },
    },
    config: undefined,
  },

  effects: {
    *fetchComplaintDetail({ payload }, { call, put }) {
      const response = yield call(getCustomerComplaintDetail, payload);
      if(response.code == 550) {
        // 没有权限
        yield put(routerRedux.goBack());
      } else {
        yield put({
          type: 'save',
          payload: {
            customerComplaintDetail: response.data.result
          },
        });
      }
      
    },
    *submitDealWith ({ payload, callback }, { call, put }) {
      const response = yield call(handleCustomerComplaint, payload);
      if(callback) callback(response.code == 200, response.msg);
    },
    
    *fetchFollowList({ payload }, { call, put }) {
      payload.page = payload.page || 1
      payload.pageSize = payload.pageSize || 10
      const response = yield call(fetchFollowList, payload);
      const result: CustomerComplaintFollowListResponseResult = response.data.result;
      const pagination = {
        total: result.count,
        pageSize: payload.pageSize,
        current: payload.page,
      }
      const followList = {
        list: result.list,
        pagination,
      };
      yield put({
        type: 'save',
        payload: {
          followList,
        }
      });
      
    },

    
    *fetchCustomerDetail({ payload }, { call, put }) {
      const response = yield call(getCustomerDetail, payload);
      yield put({
        type: 'save',
        payload: {
          customerDetail: response.data.result
        },
      });
    },
    *updateCustomerInfo({ payload, callback }, { call, put }) {
      const response = yield call(updateCustomerInfo, payload);
      if(callback) callback(response.code == 200, response.msg);
    },
    *updateContactInfo({ payload, callback }, { call, put }) {
      const response = yield call(updateContactInfo, payload);
      if(callback) callback(response.code == 200, response.msg);
    },
    *createContactInfo({ payload, callback }, { call, put }) {
      const response = yield call(createContactInfo, payload);
      if(callback) callback(response.code == 200, response.msg);
    },
    
    *getConfigInfo({ payload }, { call, put }) {
      const response = yield call(getConfigRule, payload);
      yield put({
        type: 'save',
        payload: {
          config: response.data.result,
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
