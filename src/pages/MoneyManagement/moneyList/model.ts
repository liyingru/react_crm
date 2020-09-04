import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {queryRule,getsettlementMangementList } from './service';

import { TableListData } from './data';
import { routerRedux } from 'dva/router';
export interface StateType {
  data: TableListData;
  distributePeopleConifg:any;
  permission:any;
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
    getDistributePeopleConifgInfo:Effect;
    getUserPermissionList:Effect;
    moneyDetails:Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'moneyMangement',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    distributePeopleConifg:[],
    permission:{}
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      if(payload&&payload.status&&parseInt(payload.status)==0) {
        payload.status = undefined;
      }
      const response = yield call(getsettlementMangementList, payload);
      let pagination = {
        total: response.data.result.total,
        pageSize: response.data.result.pageSize,
        current: payload ? payload.page : 1,
      }
      let data = {
        'list': response.data.result.rows,
        'pagination': pagination,
      };
      yield put({
        type: 'save',
        payload: {data},
        callback
      });
      if (callback) callback(response)
    },
    *moneyDetails({ payload }, { call, put }) {
      yield put(routerRedux.push({
        pathname: '/money/moneyDetails',
        state: {
          ...payload
        },
      }));
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
