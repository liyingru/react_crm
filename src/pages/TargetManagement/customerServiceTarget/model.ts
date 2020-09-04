import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getCustomerServiceTargetList } from './service';
import { TargetModalState } from '../model';
export interface ModalState extends TargetModalState {
  fuck: string;
  fuck1: string;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ModalState) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: ModalState;
  reducers: {
    save: Reducer<ModalState>;
  };
  effects: {
    fetchCustomerServiceTargetList: Effect;
  };
}

const Model: ModelType = {
  namespace: 'customerSerivceTargetManagement',
  state: {
    fuck: '',
    fuck1: '',
    structureList: [],
    userList: [],
  },
  effects: {
    *fetchCustomerServiceTargetList({ payload, callback }, { call, put }) {
      const response = yield call(getCustomerServiceTargetList, payload);
      // console.log(JSON.stringify(response.data.result));
      yield put({
        type: 'save',
        payload: {
          fuck: 'sssssss',
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

