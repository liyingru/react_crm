import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {getGroupMangementList,getChangeStatus } from './service';

import { TableListData} from './data';
import { routerRedux } from 'dva/router';

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
      add: Effect;
      remove: Effect;
      update: Effect;
      newlead: Effect;
      details: Effect;
      customerDetails: Effect;
      newGroup:Effect;
      changeStatusGroup:Effect;
    };
    reducers: {
      save: Reducer<StateType>;
    };
}

const Model : ModelType = {
    namespace: 'groupMangement',
    state: {
        data: {
          list: [],
          pagination: {},
        },
    },
    
    effects: {
        *newGroup({ payload }, { call, put }) {
          yield put({
            type: 'save',
            payload,
          });
          yield put(routerRedux.push('/group/groupnew'));
        },
        *fetch({ payload,callback}, { call, put }) {
            const response = yield call(getGroupMangementList, payload);
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
        // 冻结/解冻组
        *changeStatusGroup({ payload, callback }, { call, put }) {
          let response = yield call(getChangeStatus, payload);
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