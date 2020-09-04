import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryStructureList, queryUserList } from './service';

export interface TargetModalState {
  structureList: [],
  staffList: []
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: TargetModalState) => T) => T },
) => void;

export interface TargetModelType {
  namespace: string;
  state: TargetModalState;
  reducers: {
    save: Reducer<TargetModalState>;
  };
  effects: {
    fetchStructureList: Effect;
    fetchUserList: Effect;
  };
}

const Model: TargetModelType = {
  namespace: 'targetManagement',
  state: {
    structureList: [],
    staffList: [],
  },
  effects: {
    *fetchStructureList({ payload, callback }, { call, put }) {
      const response = yield call(queryStructureList, payload);
      // console.log(JSON.stringify(response.data.result.rows));
      yield put({
        type: 'save',
        payload: {
          structureList: response.data.result.rows[0].structureList,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *fetchUserList({ payload, callback }, { call, put }) {
      const response = yield call(queryUserList, payload);
      // console.log(JSON.stringify(response.data.result.rows));
      yield put({
        type: 'save',
        payload: {
          staffList: response.data.result.rows,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;

