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
    taskDetailCtrl: Effect;
    deleteTaskCtrl: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

export interface StateType {
  configData: {},
}

const Model: ModelType = {
  namespace: 'taskDetail',
  state: {

    configData: {},
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
    // 任务详情
    *taskDetailCtrl({ payload, callback }, { call, put }) {
      let response = yield call(taskDetailCtrl, payload);
      if (callback) callback(response);
    },
    // 删除任务
    *deleteTaskCtrl({ payload, callback }, { call, put }) {
      let response = yield call(deleteTaskCtrl, payload);
      if (callback) callback(response);
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

