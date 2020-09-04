import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getCustomerList, search, customerDetailById, repeatSubmit } from './service';

import { routerRedux } from 'dva/router';
import { CustomerLisItem } from '@/pages/OrderManagement/newOrder/data';
import { CustomerDataSimple } from '@/pages/ReviewManagement/repeatDetail/data';

export interface StateType {
  customerListSinglePageData: CustomerDataSimple[]|undefined,
  stayCustomerSearchAmount: number,
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    search: Effect;
    customerDetailById: Effect;
    fetchCustomerList: Effect;
    submitForm: Effect;
    toReview: Effect;
    backToCustomerDetail: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'startDuplicateCustomerModel',
  state: {
    customerListSinglePageData: undefined,
    stayCustomerSearchAmount: 0,
  },

  effects: {
    *fetchCustomerList({ payload,callback }, { call,put }) {
      let response = yield call(getCustomerList, payload);
      yield put({
        type: 'save',
        payload:{customerListSinglePageData :response.data.result.rows},
        callback
      });
      if(callback)callback(response)
    },
    *search({ payload,callback }, { call,put }) {
      let response = yield call(search, payload);
      yield put({
        type: 'save',
        payload:{customerListSinglePageData :response.data.result.rows, 
          stayCustomerSearchAmount: response.data.result.total},
        callback
      });
      if(callback)callback(response.code == 200, response.msg)
    },
    *customerDetailById({ payload,callback }, { call,put }) {
      let response = yield call(customerDetailById, payload);
      if(callback)callback(response.code == 200, response.data.result)
    },
    *submitForm({ payload, callback }, { call,put }) {
      let response = yield call(repeatSubmit, payload);
      if(callback)callback(response.code == 200, response.msg)
    },
    *toReview({ payload }, { put }) {
      yield put({
          type: 'save',
          payload,
      });
      yield put(routerRedux.push({
          pathname: '/review/reviewlist',
          state: payload,
      }));
    },
    *backToCustomerDetail({ payload }, { put }) {
      yield put(routerRedux.goBack());
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
