import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { fakeSubmitForm, createContract, getContractConfig, searchUser } from './service'; 
import { routerRedux } from 'dva/router';
import { ConfigData } from './data';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface StateType {
  contractConfig: ConfigData;
  userList:[]
}


export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    addContract: Effect;
    getContractConfig: Effect;
    searchUser: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}
const Model: ModelType = {
  namespace: 'contractManagement',

  state: {
  contractConfig: {
    weddingStyleList: [],
    weddingTypeList: [],
    contractStatusList: [],
    taocanList: [],
    baseInfo:{},
    structureList:[],
    receivablesTypeList:[],
    },
    userList:[],
  },
  effects: {
      //新建合同
      *addContract({ payload, callback }, { call }) { 
        const response =  yield call(createContract, payload); 
        const value = response.data.result
        if (callback) callback(response.code == 200,response.msg,value);
      },
   

      //获取配置项
      *getContractConfig({ payload }, { call, put }) {
        const response = yield call(getContractConfig, payload);
        yield put({
          type: 'save',
          payload: {
            contractConfig: response.data.result,
          }
        });
      },

       //搜索用户
       *searchUser({ payload }, { call, put }) {
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
      save(state, action) {
        return {
          ...state,
          ...action.payload,
        };
      },
    },
  };

export default Model;
