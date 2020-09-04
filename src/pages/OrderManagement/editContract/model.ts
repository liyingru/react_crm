import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { fakeSubmitForm, createContract, getContractConfig, searchUser, contractSearchProduct, updateContract } from './service';
import { routerRedux } from 'dva/router';
import { ConfigData } from './data';
import { ContractConfigData } from '../newContractNew/data';
import { getUserPermissionList } from '@/pages/CustomerManagement/sunnyList/service';
import { Permission } from '@/commondata';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface StateType {
  contractConfig: ContractConfigData;
  userList: []
  searchProductList: []
  searchUserList: []
  stayProductSearchAmount: number
  permission: Permission | undefined;
}


export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    addContract: Effect;
    getContractConfig: Effect;
    searchUser: Effect;
    contractSearchProduct: Effect;
    updateContract: Effect;
    searchProduct: Effect;
    getUserPermissionList: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}
const Model: ModelType = {
  namespace: 'editContractManagement',

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
    searchUserList: [],
    stayProductSearchAmount: 0,
    permission: undefined
  },
  effects: {



    //编辑合同
    *updateContract({ payload, callback }, { call }) {
      const response = yield call(updateContract, payload);
      const value = response.data.result
      if (callback) callback(response.code == 200, response.msg, value);
    },
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
          searchUserList: response.data.result,
        }
      });
    },

    //搜索产品
    *contractSearchProduct({ payload, callback }, { call, put }) {
      const response = yield call(contractSearchProduct, payload);
      const productList = response.data.result.rows
      const total = (response.data.result.total);
      yield put({
        type: 'save',
        payload: {
          searchProductList: productList,
          stayProductSearchAmount: total
        },
        callback
      });
      if (callback) callback(response.code == 200, response.msg)
    },

    //搜索产品
    *searchProduct({ payload, callback }, { call, put }) {
      const response = yield call(contractSearchProduct, payload);
      const productList = response.data.result.rows
      if (callback) callback(productList, response.data.result.total)
    },

    *getUserPermissionList({ payload }, { call, put }) {
      const response = yield call(getUserPermissionList, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          permission: response.data.result
        },
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
