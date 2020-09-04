import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { ownerChannelGetList,getEditChannelList } from './service';


export interface StateType {
  data: [],
  allSelectChannelList:any[]
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    channelGetList: Effect;
    getEditChannelList: Effect;

  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'customerFromConfig',

  state: {
    data: [],
    allSelectChannelList:[],
  },

  effects: {
    *channelGetList({ payload }, { call, put }) {
      const response = yield call(ownerChannelGetList, payload);
      let data = response.data.result
      yield put({
        type: 'save',
        payload: { data },
      });
    },

    *getEditChannelList({ payload }, { call, put }) {
      const response = yield call(getEditChannelList, payload);
      let data = response.data.result
      yield put({
        type: 'save',
        payload: { 
          allSelectChannelList: data
         },
      });
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
