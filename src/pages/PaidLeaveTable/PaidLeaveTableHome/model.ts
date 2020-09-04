import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getSchedulingList, addScheduling, editScheduling, deleteScheduling, searchUser } from './service';

import { DayOffListData } from './data';
import { UserInfo } from '@/pages/user/login/data';

export interface StateType {
  dayOffList: DayOffListData;
  userList: UserInfo[]|undefined;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  temp: any;
  state: StateType;
  effects: {
    fetchSchedulingList: Effect;
    addScheduling: Effect;
    editScheduling: Effect;
    deleteScheduling: Effect;
    fetchUserList: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'paidLeaveTableHomeModel',

  temp: {},

  state: {
    dayOffList: {
      list: [],
      pagination: {}
    },
    userList: undefined,
  },

  effects: {
    *fetchSchedulingList({ payload }, { call, put }) {
      if (payload == undefined) {
        payload = {}
      }
      payload.page = payload.page || 1
      payload.pageSize = payload.pageSize || 10
      const response = yield call(getSchedulingList, payload);
      yield put({
        type: 'save',
        payload: {
          dayOffList: {
            list: response.data.result.rows,
            pagination: {
              total: response.data.result.total,
              pageSize: response.data.result.page_size || payload.pageSize,
              current: payload ? payload.page : 1,
            }
          }
        },
      });
    },
    *addScheduling({ payload, callback }, { call, put }) {
      const response = yield call(addScheduling, payload);
      if (callback) callback(response.code == 200, response.msg);
    },
    *editScheduling({ payload, callback }, { call, put }) {
      const response = yield call(editScheduling, payload);
      if (callback) callback(response.code == 200, response.msg);
    },
    *deleteScheduling({ payload, callback }, { call, put }) {
      const response = yield call(deleteScheduling, payload);
      if (callback) callback(response.code == 200, response.msg);
    },
    *fetchUserList({ payload }, { call, put }) {
      const response = yield call(searchUser, payload);
      yield put({
        type: 'save',
        payload: {
          userList: response.data.result,
        }
      });
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
