import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  initData, taskConfigCtrl, createTaskCtrl,
  updateTaskCtrl, taskDetailCtrl, distributeUserCtrl,
  deleteTaskCtrl, deleteConditionCtrl, changeStatuTaskCtrl, recoveryDataTaskCtrl,
  getGroupUserListCtrl, searchUserCtrl
} from '../TaskList/service';

export interface TableListParams {

}
export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    taskConfigCtrl: Effect;
    createTaskCtrl: Effect;
    taskDetailCtrl: Effect;
    updateTaskCtrl:Effect;
    // 2020.3.13;
    getGroupUserListCtrl: Effect;
    searchUserCtrl: Effect;
    distributeUserCtrl: Effect;
    
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

export interface StateType {
  configData: {},
  searchUserData: [],
  getGroupUserData: []
}

const Model: ModelType = {
  namespace: 'newTask',
  state: {

    configData: {},
    searchUserData: [],
    getGroupUserData: []
  },
  effects: {
    // 任务配置
    *taskConfigCtrl({ payload }, { call, put }) {
      let response = yield call(taskConfigCtrl, payload);
      yield put({
        type: 'save',
        payload: { configData: response.data.result },
      });
    },
    // 创建任务
    *createTaskCtrl({ payload, callback }, { call, put }) {
      let response = yield call(createTaskCtrl, payload);
      if (callback) callback(response);
    },
     // 更新任务
     *updateTaskCtrl({ payload, callback }, { call, put }) {
      let response = yield call(updateTaskCtrl, payload);
      if (callback) callback(response);
    },
    // 任务详情
    *taskDetailCtrl({ payload, callback }, { call, put }) {
      let response = yield call(taskDetailCtrl, payload);
      if (callback) callback(response);
    },
    // 搜索用户 3.13 2020
    *searchUserCtrl({ payload, callback }, { call, put }) {
      let response = yield call(searchUserCtrl, payload);
      yield put({
        type: 'save',
        payload: { searchUserData: response.data.result },
      });
    },
    // 搜索组
    *getGroupUserListCtrl({ payload, callback }, { call, put }) {
      let response = yield call(getGroupUserListCtrl, payload);
      yield put({
        type: 'save',
        payload: { getGroupUserData: response.data.result },
      });
    },
     // 分配任务
     *distributeUserCtrl({ payload, callback }, { call, put }) {
      let response = yield call(distributeUserCtrl, payload);
      if (callback) callback(response);
    },


  },

  reducers: {
    // save(state, action) {
    //   return {
    //     ...state,
    //     data: action.payload,
    //     configData:action.payload,
    //   };
    // },
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
  },

};

export default Model;

