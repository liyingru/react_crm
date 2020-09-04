import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {getProductMangementList ,delProductList,getStoreList} from './service';

import { TableListData,StoreDataList} from './data';

export interface StateType {
    data: TableListData;
    storeData:StoreDataList,
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
      delProduct:Effect;
      storeList:Effect;
    };
    reducers: {
      save: Reducer<StateType>;
      storeSave: Reducer<StateType>;
    };
}

const Model : ModelType = {
    namespace: 'productMangement',
    state: {
        data: {
          list: [],
          pagination: {},
        },
        storeData:[],
    },
    
    effects: {
        *fetch({ payload,callback}, { call, put }) {
            const response = yield call(getProductMangementList, payload);
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
              payload: data,
            });
            if (callback) callback(response);
        },
        // 删除产品
        *delProduct({ payload, callback }, { call, put }) {
          let response = yield call(delProductList, payload);
          if (callback) callback(response);
        },
        *storeList({ payload }, { call, put }) {
          const response = yield call(getStoreList, payload);
          yield put({
            type: 'storeSave',
            payload: {
              storeData:response.data.result.rows
            },
          })
        },
    },
    reducers: {
        save(state, action) {
          return {
            ...state,
            data: action.payload
          };
        },
        storeSave(state, { payload }) {
          return {
            ...state,
            ...payload
          };
      },
    },
}


export default Model;