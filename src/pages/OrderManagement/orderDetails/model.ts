import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  getOrderDetails, getConfigData, getGroupUserList, getContractList, isFriend,
  getUserPermissionList, getFollowList, percentUserList,
  updateRatio, getMoneyonfig, contractSearchProduct, bindProductCtrl, unBindProduct, getStoreSettlement
} from './service';
import { OrderDetailsModel, configData, userlistInfoItem, contractItem, FollowListItem, percentUserlistInfoItem, followDataModel, SettlementInfoItem } from './data';
import { routerRedux } from 'dva/router';
import { MerchantRemarkData, ThirdRecordData } from '@/pages/DxlLeadsManagement/dxlLeadsList/data';
import { thirdrecardsRule, merchantnotesRule } from '@/pages/DxlLeadsManagement/dxlLeadsList/service';
import { ConfigCommon } from '@/commondata';


export interface StateType {
  data: OrderDetailsModel;
  configData: ConfigCommon;
  isFriend: boolean;
  userList: userlistInfoItem[];
  contractList: contractItem[];
  followList: FollowListItem[];
  permission: {
    callcenteradapter_getrecordlist: boolean,
    requirementadapter_updatereq: boolean,
    listenrecorder: boolean,
    thirdnotebutton: boolean,
  };
  percentUserList: percentUserlistInfoItem[];
  moneyonfig: {};
  searchProductResultList: [];
  loading: boolean;
  merchantRemarkData: MerchantRemarkData;
  thirdRecordData: ThirdRecordData;
  settlementInfoList:[]

}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getDetails: Effect;
    getConfig: Effect;
    getGroupUserList: Effect;
    newContractPage: Effect;
    getContractList: Effect;
    getIsFriend: Effect;
    getUserPermissionList: Effect;
    getFollowList: Effect;
    getPercentUserList: Effect;
    updatePercentUser: Effect;
    getMoneyonfig: Effect;
    searchProduct: Effect;
    bindProductCtrlReq: Effect;
    unBindProduct: Effect;
    fetchMerchantnotes: Effect;
    fetchThirdrecards: Effect;
    getStoreSettlement: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'getDetailsModelType',

  state: {
    data: {
      // 通话记录
      callRecord: [],
      // 联系人
      contacts: [],
      // 合同信息
      contractInfo: {},
      // 回款记录
      receivablesRecord: [],
      // 订单详情
      orderInfo: {},

      customerInfo: {},

      // 跟进记录配置项
      followData: {},

      // 确认到店数据
      reserve: [],

      // 确认到点确认次数
      reserve_confirm_count: 0,
    },
    configData: {
      // 渠道
      channel: [],
      // 客户级别
      customerLevel: [],
      // 跟进状态
      orderFollowStatus: [],
      // 客户身份
      identity: [],
      // 性别
      gender: [],
      // 婚礼风格
      weddingStyle: [],
      // 业务品类
      category: [],
      // 方便联系
      contactTime: [],
      // 跟进方式
      contactWay: [],

      orderFollowTag: [],
    },
    isFriend: false,
    userList: [],
    contractList: [],
    // 权限
    permission: {
      callcenteradapter_getrecordlist: false,
      requirementadapter_updatereq: false,
      listenrecorder: false,
      thirdnotebutton: false,
    },
    // 跟进记录
    followList: [],
    percentUserList: [],
    // 回款配置项
    moneyonfig: {},
    searchProductResultList: [],
    loading: false,
    merchantRemarkData: {
      list: [],
      pagination: {},
    },
    thirdRecordData: {
      list: [],
      pagination: {},
    },
    settlementInfoList:[]
  },

  effects: {
    *getDetails({ payload, callback }, { call, put }) {
      const response = yield call(getOrderDetails, payload);
      yield put({
        type: 'save',
        payload: {
          data: response.data.result
        },
      });
      if (callback) {
        callback(response.data.result);
      }
    },
    * getConfig({ payload }, { call, put }) {
      const response = yield call(getConfigData, payload);
      yield put({
        type: 'save',
        payload: {
          configData: response.data.result
        },
      });
    },
    * getGroupUserList({ payload }, { call, put }) {
      const response = yield call(getGroupUserList, payload);
      yield put({
        type: 'save',
        payload: {
          userList: response.data.result
        },
      });
    },
    //搜索产品
    *searchProduct({ payload, callback }, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      const response = yield call(contractSearchProduct, payload);
      const productList = response.data.result.rows
      yield put({
        type: 'save',
        payload: {
          searchProductResultList: productList,
          loading: false
        },
      });
      if (callback) callback(productList, response.data.result.total)
    },
    // 绑定产品
    *bindProductCtrlReq({ payload, callback }, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      const response = yield call(bindProductCtrl, payload);
      yield put({
        type: 'save',
        payload: { loading: false },
      });
      if (callback) callback(response)
    },
    // 解绑产品
    *unBindProduct({ payload, callback }, { call, put }) {
      const response = yield call(unBindProduct, payload);
      if (callback) callback(response.code==200)
    },
    * newContractPage({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload,
      });
      const orderId = payload.orderId;
      yield put(routerRedux.push({
        pathname: '/order/orderManagement/newContractNew',
        state: {
          orderId: orderId,
        },
      }));
    },
    // updateOrderCtrl
    * getIsFriend({ payload }, { call, put }) {
      const response = yield call(isFriend, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          isFriend: response.data.result
        },
      });
    },
    *getContractList({ payload }, { call, put }) {
      const response = yield call(getContractList, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          contractList: response.data.result.rows
        },
      });
    },

    *getStoreSettlement({ payload }, { call, put }) {
      const response = yield call(getStoreSettlement, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          settlementInfoList: response.data.result
        },
      });
    },
    * getUserPermissionList({ payload }, { call, put }) {
      const response = yield call(getUserPermissionList, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          permission: response.data.result
        },
      });
    },
    * getFollowList({ payload }, { call, put }) {
      const response = yield call(getFollowList, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          followList: response.data.result
        },
      });
    },
    * getPercentUserList({ payload }, { call, put }) {
      const response = yield call(percentUserList, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          percentUserList: response.data.result
        },
      });
    },
    * updatePercentUser({ payload, callback }, { call, put }) {
      const response = yield call(updateRatio, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          callback,
        },
      });
      if (callback) callback(response.code == 200, response.msg);
    },
    * getMoneyonfig({ payload }, { call, put }) {
      const response = yield call(getMoneyonfig, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          moneyonfig: response.data.result,
        },
      });
    },
    *fetchMerchantnotes({ payload, callback }, { call, put }) {
      const response = yield call(merchantnotesRule, payload);
      if (response.code == 200) {
        let pagination = {
          total: response.data.result.count,
          pageSize: response.data.result.size,
          current: payload ? payload.index : 1,
        }
        let fetchData = {
          'list': response.data.result.list,
          'pagination': pagination,
        };
        console.log(fetchData);
        yield put({
          type: 'save',
          payload: {
            merchantRemarkData: fetchData,
          }
        });
        if (callback) callback();
      } else {
        let data = {
          list: [],
          pagination: {},
        }
        yield put({
          type: 'save',
          payload: {
            merchantRemarkData: data,
          }
        });
      }

    },
    *fetchThirdrecards({ payload, callback }, { call, put }) {
      const response = yield call(thirdrecardsRule, payload);
      if (response.code == 200) {
        let pagination = {
          total: response.data.result.count,
          pageSize: response.data.result.size,
          current: payload ? payload.index : 1,
        }
        let fetchData = {
          'list': response.data.result.list,
          'pagination': pagination,
        };
        console.log(fetchData);
        yield put({
          type: 'save',
          payload: {
            thirdRecordData: fetchData,
          }
        });
        if (callback) callback();
      } else {
        let data = {
          list: [],
          pagination: {},
        }
        yield put({
          type: 'save',
          payload: {
            thirdRecordData: data,
          }
        });
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