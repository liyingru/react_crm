import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryRule, getDistributePeopleConifgRule, getUserPermissionListCtrl } from './service';

import { TableListData, TableListPagination } from './data';
import { routerRedux } from 'dva/router';
export interface StateType {
  hyData: TableListData;
  hqData: TableListData;
  otherData: TableListData;
  distributePeopleConifg: any;
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
    initData: Effect;
    getOrder: Effect;
    getDistributePeopleConifgInfo: Effect;
    getUserPermissionList: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'SaleOrderTableList',
  state: {
    hyData: {
      list: [],
      pagination: {},
    },
    hqData: {
      list: [],
      pagination: {},
    },
    otherData: {
      list: [],
      pagination: {},
    },
    distributePeopleConifg: [],
    permission: {},
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

    *getOrder({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload,
      });
      yield put(routerRedux.push('/saleManagement/saleList/getOrder'));
    },
    *fetch({ payload, callback }, { call, put }) {
      if (payload && payload.status && parseInt(payload.status) == 0) {
        payload.status = undefined;
      }
      if (payload == undefined) {
        payload = {}
      }
      payload.page = payload.page || 1
      payload.pageSize = payload.pageSize || 20
      const response = yield call(queryRule, payload);
      let pagination = {
        total: response.data.result.total,
        pageSize: response.data.result.page_size,
        current: payload ? payload.page : 1,
      }
      if (payload.category == '1') {
        let hydata = {
          'list': response.data.result.rows,
          'pagination': pagination,
        };
        yield put({
          type: 'save',
          payload: {
            hyData: hydata,
          },
          callback
        });
      } else if (payload.category == '2') {
        let hqdata = {
          'list': response.data.result.rows,
          'pagination': pagination,
        };
        yield put({
          type: 'save',
          payload: {
            hqData: hqdata,
          },
          callback
        });
      } else {
        let otherData = {
          'list': response.data.result.rows,
          'pagination': pagination,
        };
        yield put({
          type: 'save',
          payload: { otherData },
          callback
        });
      }
      if (callback) callback(response)
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
