import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';

import {
  getCustomerDetail, getCustomerConfig, transferCustomer, getAllUser, getRecordList, backToPubSea, backToDeadSea
  , getMerchantList, getOperateConfig, followList, isFriend, getReqDetail, customerChildren, getUserPermissionList, getRulesUserInfo
} from '@/pages/CustomerManagement/customerDetail/xp/service';

import { getReqQaDetail,getReqQaReqList,getReqQaCreate,getReqQaPhase,getAllRecordList,reDistributeCompany } from './service';


import { CustomerDetail, UserEntity, FollowListItem } from '@/pages/CustomerManagement/customerDetail/dxl/data';
import { ConfigList, OperateConfig } from '@/pages/CustomerManagement/commondata';
import { routerRedux } from 'dva/router';
import { CustomerQualityInspection, CustomerLeadsListData } from '@/pages/LeadsManagement/leadsDetails/data';
import { reqListRule, createReqRule, updateReqRule, closeReqRule, openReqRule, submitComplaint, distributeCompany, turnTrueRule, customerLeadsRule } from '@/pages/LeadsManagement/leadsDetails/service';
import { CustomerDataSimple } from '@/pages/ReviewManagement/repeatDetail/data';
import { Permission } from '@/commondata';
import { XPFlowInfo } from '@/pages/DxlLeadsManagement/dxlLeadsList/data';
import { getXPFlowInfoRule, updateReqLiteRule } from '@/pages/DxlLeadsManagement/dxlLeadsList/service';
import { storeList, createOrder } from '@/pages/OrderManagement/newOrder/service';
import { Merchant } from '@/pages/OrderManagement/newOrder/data';
import { getUserLsit } from '@/pages/SunnyRulesManagement/SunnyRulesList/service';
import { ReqQaDetail, RequirementDataGroupDetails } from './data';



export interface StateType {
  config: ConfigList;
  allUser: UserEntity[];
  merchantList: any;
  qualityInspection: CustomerQualityInspection[];
  qualityInspectionAll: CustomerQualityInspection[];
  customerFollowInfo: FollowListItem[];
  isFriend: boolean;
  reqGroupData: RequirementDataGroupDetails,
  permission: Permission | {};
  customerChildrenData: CustomerDataSimple[];
  xpFollowInfo: XPFlowInfo,
  merchantsListSinglePageData: Merchant[] | undefined,
  merchantsTotal: number,
  customerLeadsListData: CustomerLeadsListData[],

  data: ReqQaDetail;
  rulesUserInfo: any;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    config: Effect;
    transferCustomer: Effect;
    customerManagementPage: Effect;
    startDuplicateCustomer: Effect;
    getCustomerChildren: Effect;
    getAllUser: Effect;
    getRecordList: Effect;
    getMerchantList: Effect;
    getFollowList: Effect;
    getIsFriend: Effect;
    fetchReqList: Effect;
    getUserPermissionList: Effect;
    submitComplaint: Effect;
    toComplaintDetail: Effect;
    backToPubSea: Effect;
    backToDeadSea: Effect;
    router: Effect;
    getXPFlowInfo: Effect;
    updateReqLite: Effect;
    distributeCompany: Effect;
    getRecommendMerchants: Effect;
    submitAdvancedForm: Effect;
    turnTrue: Effect;
    clearData: Effect;
    fetchCustomerLeadsList: Effect;

    fetchQaDetail:Effect;
    getReqQaReqList:Effect;
    getReqQaCreate:Effect;
    getReqQaPhase:Effect;
    getAllRecordList:Effect;
    redistributeCompany:Effect;
    // 根据渠道获取用户列表
    getRulesUserInfo:Effect;
    
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'qaManagementDetail',
  state: {
    data: {
      customerData: {},
      contactUserData: [],
      reqTeamData: [],
      followData: {
        showFollowButton: 0,
        showFollowProductAndCoupon: 0,
        showDistributedCompany: 0,
        distributedCompany: [],
        followTab: [],
      },
      reqQaLiteData: {},
      cooperationData: [],
      reserveData: [],
    },
    config: {},
    customerFollowInfo: [],
    allUser: [],
    qualityInspection: [],
    qualityInspectionAll:[],
    merchantList: [],
    isFriend: false,
    reqGroupData: {
      req_qa_data: [],
      req_data: [],
    },
    // 权限
    permission: {},
    customerChildrenData: [],
    xpFollowInfo: {
      receive_user: [],
      distribute_company: [],
    },
    merchantsTotal: 0,
    customerLeadsListData:[],
    rulesUserInfo:{
      into_user_list:[],
      receive_user_list:[]
    },
  },

  effects: {
    *fetchQaDetail({ payload, callback }, { call, put }) {
      const response = yield call(getReqQaDetail, payload);
      yield put({
        type: 'save',
        payload: {
          data: response.data.result
        },
      });
      if (callback) callback(response.data.result)
    },
    *submitAdvancedForm({ payload, callback }, { call, put }) {
      let response = yield call(createOrder, payload);
      if (response.code == 200) {
        yield put({
          type: 'save',
          payload,
        });
      }
      if (callback) callback(response.code == 200);
    },
    *getRecommendMerchants({ payload, callback }, { call, put }) {
      const response = yield call(storeList, payload);
      yield put({
        type: 'save',
        payload: { merchantsListSinglePageData: response.data.result.rows, merchantsTotal: response.data.result.total },
        callback
      });
      if (callback) callback(response)
    },
    *getXPFlowInfo({ payload, callback }, { call, put }) {
      const response = yield call(getXPFlowInfoRule, payload);
      yield put({
        type: 'save',
        payload: {
          xpFollowInfo: response.data.result,
        }
      });
      if (callback && response.code) callback(response.data.result);
    },
    *distributeCompany({ payload, callback }, { call, put }) {
      const response = yield call(distributeCompany, payload);
      yield put({
        type: 'save',
        payload,
      });
      if (callback) callback(response.code == 200);
    },
    *turnTrue({ payload, callback }, { call, put }) {
      const response = yield call(turnTrueRule, payload);
      yield put({
        type: 'save',
        payload,
      });
      if (callback) callback(response.code == 200);
    },
    *updateReqLite({ payload, callback }, { call, put }) {
      const response = yield call(updateReqLiteRule, payload);
      yield put({
        type: 'save',
        payload,
      });
      if (callback) callback(response.code == 200, response.msg);
    },
    *config({ payload,callback }, { call, put }) {
      const response = yield call(getCustomerConfig, payload);
      let arr = response.data.result;
      yield put({
        type: 'save',
        payload: {
          config: arr
        },
      })
      if (callback) callback(response.code == 200, response.msg);
    },
    //转让客户给同事
    *transferCustomer({ payload, callback }, { call }) {
      const response = yield call(transferCustomer, payload);
      if (callback) callback(response.code == 200, response.msg);
    },

    //客户管理
    *customerManagementPage({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload,
      });
      yield put(routerRedux.push('/customer/customerManagement'));
    },

    //客户重复，发起重单
    *startDuplicateCustomer({ payload }, { call, put }) {
      console.log("传入参数：" + JSON.stringify(payload))
      yield put(routerRedux.push({
        pathname: '/customer/customerManagement/startDuplicateCustomer',
        state: {
          ...payload
        },
      }));
    },

    //客户重复，查看亲子单
    *getCustomerChildren({ payload, callback }, { call, put }) {
      const response = yield call(customerChildren, payload);
      yield put({
        type: 'save',
        payload: {
          customerChildrenData: response.data.result
        },
      });
      if (callback) { callback(response.code == 200); }
    },

    *getAllUser({ payload }, { call, put }) {
      const response = yield call(getAllUser, payload);
      yield put({
        type: 'save',
        payload: {
          allUser: response.data.result.rows
        },
      });
    },
    *getRecordList({ payload }, { call, put }) {
      const response = yield call(getRecordList, payload);
      yield put({
        type: 'save',
        payload: {
          qualityInspection: response.data.result,
        }
      });
    },
    *getAllRecordList({ payload }, { call, put }) {
      const response = yield call(getAllRecordList, payload);
      yield put({
        type: 'save',
        payload: {
          qualityInspectionAll: response.data.result,
        }
      });
    },
    *getMerchantList({ payload }, { call, put }) {
      const response = yield call(getMerchantList, payload);
      yield put({
        type: 'save',
        payload: {
          merchantList: response.data.result,
        }
      });
    },
    *getFollowList({ payload }, { call, put }) {
      const response = yield call(followList, payload);
      yield put({
        type: 'save',
        payload: {
          customerFollowInfo: response.data.result,
        }
      });
    },
    *getIsFriend({ payload }, { call, put }) {
      const response = yield call(isFriend, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          isFriend: response.data.result
        },
      });
    },
    *fetchReqList({ payload }, { call, put }) {
      const response = yield call(getReqQaReqList, payload);
      yield put({
        type: 'save',
        payload: {
          reqGroupData: response.data.result,
        }
      });
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
    *submitComplaint({ payload, callback }, { call, put }) {
      const response = yield call(submitComplaint, payload);
      if (callback) callback(response.code == 200, response.msg, response.data.result);
    },
    *toComplaintDetail({ payload }, { put }) {
      yield put(routerRedux.push({
        pathname: '/customerComplaintManagement/detail',
        state: {
          ...payload
        },
      }));
    },
    *backToPubSea({ payload, callback }, { call, put }) {
      const response = yield call(backToPubSea, payload);
      if (callback) callback(response.code == 200, response.msg);
    },
    *backToDeadSea({ payload, callback }, { call, put }) {
      const response = yield call(backToDeadSea, payload);
      if (callback) callback(response.code == 200, response.msg);
    },

    *redistributeCompany({ payload, callback }, { call, put }) {
      const response = yield call(reDistributeCompany, payload);
      if (callback) callback(response.code == 200, response.data.result);
    },


    *router({ payload }, { call, put }) {
      yield put(routerRedux.push({
        pathname: payload.pathname,
        state: {
          ...payload.params
        },
      }));
    },

    *fetchCustomerLeadsList({ payload }, { call, put }) {
      const response = yield call(customerLeadsRule, payload);
      yield put({
        type: 'save',
        payload: {
          customerLeadsListData: response.data.result,
        }
      });
    },
    *getRulesUserInfo({ payload }, { call, put }) {
      const response = yield call(getRulesUserInfo, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          rulesUserInfo: response.data.result
        },
      });
    },

    *clearData({ payload }, { call, put }){
      yield put({
        type: 'save',
        payload:{
          data: {
            customerData: {},
            contactUserData: [],
            reqTeamData: [],
            // contractData: {
            //   total: 0,
            //   rows: [],
            // },
            followData: {
              showFollowButton: 0,
              showFollowProductAndCoupon: 0,
              showDistributedCompany: 0,
              distributedCompany: [],
              followTab: [],
            },
            reqQaLiteData: {},
            cooperationData: [],
            reserveData: [],
          },
          config: {},
          customerFollowInfo: [],
          allUser: [],
          qualityInspection: [],
          merchantList: [],
          isFriend: false,
          reqGroupData: {
            req_qa_data: [],
            req_data: [],
          },
          // 权限
          permission: {},
          customerChildrenData: [],
          xpFollowInfo: {
            receive_user: [],
            distribute_company: [],
          },
          merchantsTotal: 0,
          customerLeadsListData:[],
          rulesUserInfo:{
            into_user_list:[],
            receive_user_list:[]
          },
        }
      })
    }
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
