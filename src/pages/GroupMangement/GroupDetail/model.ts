import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {getGroupDetail,getGroupUpdate,deletGroupCtrl,taskConfigCtrl} from './service';

export interface StateType {
    defaultConfig:{},
    // detailData:any,
}

export type Effect = (
    action: AnyAction,
    effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
    namespace: string;
    state: StateType;
    effects: {
      getDetails:Effect;
      getUpdate:Effect;
      deletGroupReq:Effect;
      taskConfigCtrl:Effect;
    };
    reducers: {
      save: Reducer<StateType>;
    };
}

const Model : ModelType = {
    namespace: 'groupDetail',
    state: {
      defaultConfig:{},
      // detailData:{},
    },
    
    effects: {
      // *getDetails({ payload,callback }, { call, put }) {
      //   const response = yield call(getGroupDetail, payload);
      //   yield put({
      //     type: 'save',
      //     payload: { detailData: response.data.result },
      //   });
      //   if(callback)callback(response)
      // },
      *getDetails({ payload,callback }, { call, put }) {
        const response = yield call(getGroupDetail, payload);
        yield put({
          type: 'save',
          payload:response.data.result,
          callback
        });
        if(callback)callback(response)
      },
      *getUpdate({ payload,callback }, { call, put }) {
        const response = yield call(getGroupUpdate, payload);
        if (callback) callback(response.code == 200,response.msg);
      },
      *deletGroupReq({ payload,callback }, { call, put }) {
        const response = yield call(deletGroupCtrl, payload);
        if(callback)callback(response)
      },
      *taskConfigCtrl({ payload }, { call, put }) {
        let response = yield call(taskConfigCtrl, payload);
        yield put({
          type: 'save',
          payload: { defaultConfig: response.data.result },
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
}


export default Model;