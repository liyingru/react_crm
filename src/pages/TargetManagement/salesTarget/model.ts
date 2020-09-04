import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { StructureQuarterlySalesTargetModel, EmployeeQuarterlySalesTargetModel, StructureMonthlySalesTargetModel, EmployeeMonthlySalesTargetModel } from './data.d';
import {
  addStructureSelltarget,
  editStructureSelltarget,
  delStructureSelltarget,
  getStructureSelltargetList,
  getStructureSelltargetInfo,

  addUserSelltarget,
  editUserSelltarget,
  delUserSelltarget,
  getUserSelltargetList,
  getUserSelltargetInfo
} from './service';
export interface ModalState {
  structureQuarterlySalesTargetModel?: StructureQuarterlySalesTargetModel,
  employeeQuarterlySalesTargetModel?: EmployeeQuarterlySalesTargetModel,
  structureMonthlySalesTargetModel?: StructureMonthlySalesTargetModel,
  employeeMonthlySalesTargetModel?: EmployeeMonthlySalesTargetModel,
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
    addStructureSelltarget: Effect;
    editStructureSelltarget: Effect;
    delStructureSelltarget: Effect;
    getStructureSelltargetList: Effect;
    getStructureSelltargetInfo: Effect;

    addUserSelltarget: Effect;
    editUserSelltarget: Effect;
    delUserSelltarget: Effect;
    getUserSelltargetList: Effect;
    getUserSelltargetInfo: Effect;
  };
}

const Model: ModelType = {
  namespace: 'salesTargetManagement',
  state: {

  },
  effects: {
    *addStructureSelltarget({ payload, callback }, { call, put }) {
      const response = yield call(addStructureSelltarget, payload);
      console.log(JSON.stringify(response.data.result));
      yield put({
        type: 'save',
        payload: {
          result: response.data.result,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *editStructureSelltarget({ payload, callback }, { call, put }) {
      const response = yield call(editStructureSelltarget, payload);
      console.log(JSON.stringify(response.data.result));
      yield put({
        type: 'save',
        payload: {
          result: response.data.result,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *delStructureSelltarget({ payload, callback }, { call, put }) {
      const response = yield call(delStructureSelltarget, payload);
      console.log(JSON.stringify(response.data.result));
      yield put({
        type: 'save',
        payload: {
          result: response.data.result,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *getStructureSelltargetList({ payload, callback, targetType }, { call, put }) {
      const response = yield call(getStructureSelltargetList, payload);
      console.log(JSON.stringify(response.data.result));
      yield put({
        type: 'save',
        payload: {
          structureQuarterlySalesTargetModel: targetType === 0 ? response.data.result : undefined,
          structureMonthlySalesTargetModel: targetType === 1 ? response.data.result : undefined
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *getStructureSelltargetInfo({ payload, callback }, { call, put }) {
      const response = yield call(getStructureSelltargetInfo, payload);
      console.log(JSON.stringify(response.data.result));
      yield put({
        type: 'save',
        payload: {
          structureSalesTargetInfo: response.data.result,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    *addUserSelltarget({ payload, callback }, { call, put }) {
      const response = yield call(addUserSelltarget, payload);
      console.log(JSON.stringify(response.data.result));
      yield put({
        type: 'save',
        payload: {
          result: response.data.result,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *editUserSelltarget({ payload, callback }, { call, put }) {
      const response = yield call(editUserSelltarget, payload);
      console.log(JSON.stringify(response.data.result));
      yield put({
        type: 'save',
        payload: {
          result: response.data.result,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *delUserSelltarget({ payload, callback }, { call, put }) {
      const response = yield call(delUserSelltarget, payload);
      console.log(JSON.stringify(response.data.result));
      yield put({
        type: 'save',
        payload: {
          result: response.data.result,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *getUserSelltargetList({ payload, callback, targetType }, { call, put }) {
      const response = yield call(getUserSelltargetList, payload);
      console.log(JSON.stringify(response.data.result));
      yield put({
        type: 'save',
        payload: {
          employeeQuarterlySalesTargetModel: targetType === 0 ? response.data.result : undefined,
          employeeMonthlySalesTargetModel: targetType === 1 ? response.data.result : undefined
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *getUserSelltargetInfo({ payload, callback }, { call, put }) {
      const response = yield call(getUserSelltargetInfo, payload);
      console.log(JSON.stringify(response.data.result));
      yield put({
        type: 'save',
        payload: {
          userSalesTargetInfo: response.data.result,
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

