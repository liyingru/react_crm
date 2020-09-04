import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {getNoticList} from './service';

import { TableListData} from './data';

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
      fetch: Effect;
    };
    reducers: {
      save: Reducer<StateType>;
    };
}

const Model : ModelType = {
    namespace: 'messageCenterList',
    state: {
        data: {
          list: [],
          pagination: {},
        },
    },
    
    effects: {
        *fetch({ payload,callback}, { call, put }) {
            const response = yield call(getNoticList, payload);
            const pagination = {
              total: response.data.result.total,
              pageSize: response.data.result.pageSize,
              current: payload ? payload.page : 1,
            }
            const data = {
              'list': response.data.result.rows,
              'pagination': pagination,
            };
            yield put({
              type: 'save',
              payload: data,
            });
            if (callback) callback(response);
        },
        
    },
    reducers: {
        save(state, action) {
          return {
            ...state,
            data: action.payload
          };
        },
    },
}


export default Model;