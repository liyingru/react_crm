import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  initData, taskConfigCtrl, createTaskCtrl,
  updateTaskCtrl, taskDetailCtrl, distributeUserCtrl,
  deleteTaskCtrl, deleteConditionCtrl, changeStatuTaskCtrl, recoveryDataTaskCtrl,
  getGroupUserListCtrl, searchUserCtrl
} from './service';

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
    fetch: Effect;
    taskConfigCtrl: Effect;
    createTaskCtrl: Effect;
    updateTaskCtrl: Effect;
    taskDetailCtrl: Effect;
    distributeUserCtrl: Effect;
    deleteTaskCtrl: Effect;
    deleteConditionCtrl: Effect;
    changeStatuTaskCtrl: Effect;
    recoveryDataTaskCtrl: Effect;
    getGroupUserListCtrl: Effect;
    searchUserCtrl: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

export interface StateType {
  data: {
    list: [],
    pagination: {},
  },
  configData: {},
  searchUserData: [],
  getGroupUserData: [],
  taskState:{}
}

const Model: ModelType = {
  namespace: 'taskilList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    configData: {},
    searchUserData: [],
    getGroupUserData: [],
    taskState:{}
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(initData, payload);
      let pagination = {
        total: response.data.result.total,
        pageSize: response.data.result.pageSize,
        current: payload ? payload.page : 1,
      }
      let data = {
        list: response.data.result.rows,
        pagination: pagination,
      };
      yield put({
        type: 'save',
        payload: { data: data },
      });
    },
    // 任务配置
    *taskConfigCtrl({ payload }, { call, put }) {
      let response = yield call(taskConfigCtrl, payload);
      yield put({
        type: 'save',
        payload: { configData: response.data.result },
      });
    },
    // 分配任务
    *distributeUserCtrl({ payload, callback }, { call, put }) {
      let response = yield call(distributeUserCtrl, payload);
      if (callback) callback(response);
    },
    // 暂停开启任务
    *changeStatuTaskCtrl({ payload, callback }, { call, put }) {
      let response = yield call(changeStatuTaskCtrl, payload);
      if (callback) callback(response);
    },

    // 回收任务
    *recoveryDataTaskCtrl({ payload, callback }, { call, put }) {
      let response = yield call(recoveryDataTaskCtrl, payload);
      if (callback) callback(response);
    },
    // 搜索用户
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
    saveStore(state:any,{payload}){
      console.log(payload)
      if(payload){
        const newState = Object.assign({}, state, {
          taskState:  payload.taskState
        });
        // newState.taskState = payload.taskState;
        return newState;
      }
      
      
      
    }
  },

};

export default Model;

