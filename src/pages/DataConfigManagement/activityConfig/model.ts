import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { activitylist, editActivity, addActivity,deleteActivity } from './service';
import { ActivityListItem } from './data';
// import { } from './service';


export interface StateType {
  data: {
    list: ActivityListItem[],
    pagination: {},
  },
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    activityList: Effect;
    addActivity: Effect;
    editActivity: Effect;
    deleteActivity: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'activityConfig',

  state: {
    data: {
      list: [],
      pagination: {},
    },

  },

  effects: {
    *activityList({ payload }, { call, put }) {
      const response = yield call(activitylist, payload);
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
    *addActivity({ payload, callback }, { call, put }) {
      const response = yield call(addActivity, payload);
      if (callback) callback(response.code==200, response.msg);
    },
    *editActivity({ payload, callback }, { call, put }) {
      const response = yield call(editActivity, payload);
      if (callback) callback(response.code==200, response.msg);
    },
    *deleteActivity({ payload, callback }, { call, put }) {
      const response = yield call(deleteActivity, payload);
      if (callback) callback(response.code==200, response.msg);
    },
  },


  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },

  },
};

export default Model;
