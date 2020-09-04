import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { customerComplaintList, queryRule, removeRule, updateRule, getConfigRule, getLeadStatusConfigRule, getDistributePeopleConifgRule, getDistributeGroupConifgRule, leadsDistributeRule,getRequirementList } from './service';

import { routerRedux } from 'dva/router';
import { ConfigItem, ConfigData } from '@/pages/LeadsManagement/leadsDetails/data';
import { PaginationListData, CustomerComplaintListResponseResult } from '../data';

export interface StateType {
  config: ConfigData|undefined;
  data: PaginationListData;
  header: {name: string; num:number;}[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchList: Effect;
    toDetail: Effect;
    getConfigInfo: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'customerComplaintListModel',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    config: undefined,
    header:[]
  },

  effects: {
    
    *toDetail({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload,
      });
      yield put(routerRedux.push({
        pathname: '/customerComplaintManagement/detail',
        state: {
          ...payload
        },
      }));
    },
    
    *fetchList({ payload }, { call, put }) {
      if (!payload) {
        payload = {}
      }
      payload.page = payload.page || 1
      payload.pageSize = payload.pageSize || 10
      const response = yield call(customerComplaintList, payload);
      const result: CustomerComplaintListResponseResult = response.data.result;
      const pagination = {
        total: result.count,
        pageSize: payload.pageSize,
        current: payload.page,
      }
      const data = {
        list: result.list,
        pagination,
      };
      const header: {name:string; num: number;}[] = result.header;
      yield put({
        type: 'save',
        payload: {
          data,
          header
        }
      });

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
