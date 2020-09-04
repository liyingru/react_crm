import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {getCompanyList, addCompany, deleteCompany, editCompany } from './service';

import { TableListData } from './data';

export interface StateType {
  data: TableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getCompanyList: Effect;
    addCompany: Effect;
    deleteCompany: Effect;
    updateCompany: Effect;
  };
  reducers: {
    showCompanyList: Reducer<StateType>;
    // saveCompanyOptions: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'companyManagementModel',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current:1
      },
      
    },
    
  },

  effects: {
    *getCompanyList({ payload }, { call, put }) {
      const response = yield call(getCompanyList, payload);
      const pageSize = payload.pageSize;
      const current = payload.page;
      if(response.code == 200) {
        const companyList = response.data.result.rows;
        yield put({
          type: 'showCompanyList',
          payload: {
            data: {
              list: companyList,
              pagination: {
                total: response.data.result.total,
                pageSize: pageSize,
                current:current
              }
            }
           
          },
        });
      } else {

      }
    },
    *addCompany({ payload, callback }, { call, put }) {
      const response = yield call(addCompany, payload);
      if (callback) callback(response.code == 200);
    },

    *deleteCompany({ payload, callback }, { call, put }) {
      const response = yield call(deleteCompany, payload);
      if (callback) callback(response.code == 200);
    },

    *updateCompany({ payload, callback }, { call, put }) {
      const response = yield call(editCompany, payload);
      if (callback) callback(response.code == 200);
    },
  },

  reducers: {

    showCompanyList(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },

  },
};

export default Model;
