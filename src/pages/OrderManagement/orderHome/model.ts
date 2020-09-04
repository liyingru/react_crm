import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addRule, queryRule, removeRule, updateRule,getDistributePeopleConifgRule,getUserPermissionListCtrl } from './service';

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
    add: Effect;
    remove: Effect;
    update: Effect;
    initData: Effect;
    newOrder: Effect;
    getDistributePeopleConifgInfo:Effect;
    getUserPermissionList:Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'newOrderTableList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    distributePeopleConifg:[],
    permission:{}
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
    *getDistributePeopleConifgInfo({ payload }, { call, put }) {
      const response = yield call(getDistributePeopleConifgRule, payload);
      yield put({
        type: 'save',
        payload: {
          distributePeopleConifg: response.data.result,
        }
      });
    },
    // *orderDetails({ payload }, { call, put }) {
    //   yield put({
    //     type: 'save',
    //     payload,
    //   });
    //  // yield put(routerRedux.push('/orderdetails'));
    // //  yield put(routerRedux.push({
    // //   pathname: '/api-manage/create-sub-system',
    // //   query: {
    // //     id: 6,
    // //     value: 'lala',
    // //   }
    // // }))

    // },

    *newOrder({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload,
      });
      yield put(routerRedux.push('/order/newOrder'));
    },
    *fetch({ payload, callback }, { call, put }) {
      if(payload&&payload.status&&parseInt(payload.status)==0) {
        payload.status = undefined;
      }
      if(!payload){
        payload = {}
      }
      payload.from = '1.0.0'
      const response = yield call(queryRule, payload);
      let pagination = {
        total: response.data.result.total,
        pageSize: response.data.result.page_size,
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
