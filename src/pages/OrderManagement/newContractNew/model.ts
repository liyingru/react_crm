import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { fakeSubmitForm, createContract, getContractConfig, searchUser, contractSearchProduct } from './service';
import { routerRedux } from 'dva/router';
import { ConfigData, ContractConfigData } from './data';


export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface StateType {
  contractConfig: ContractConfigData;
  userList: []
  searchProductList: []
  stayProductSearchAmount: number
}


export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    addContract: Effect;
    getContractConfig: Effect;
    searchUser: Effect;
    contractSearchProduct: Effect;
    searchProduct: Effect;
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
      baseInfo: {},
      structureList: [],
      photoStyleList: [],
      preferentialTypeList: [],
      receivablesTypeList: [],
      agreementTypeList: [],
      productList: []
    },
    userList: [],
    searchProductList: [],
    stayProductSearchAmount: 0,
  },
  effects: {
    //新建合同
    *addContract({ payload, callback }, { call }) {
      const response = yield call(createContract, payload);
      const value = response.data.result
      if (callback) callback(response.code == 200, response.msg, value);
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
          searchProductList: response.data.result,
        }
      });
    },

    //搜索产品
    *searchProduct({ payload, callback }, { call, put }) {
      const response = yield call(contractSearchProduct, payload);
      const productList = response.data.result.rows
      if (callback) callback(productList, response.data.result.total)
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
