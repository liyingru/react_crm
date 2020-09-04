import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';

import {
  getCustomerDetail, getCustomerConfig, getOrderDetails, contractSearchProduct, bindProductCtrl, updateOrder, getMoneyConfig, getGroupUserList,      
  transferCustomer, getAllUser, getRecordList, backToPubSea, backToDeadSea, unBindProduct
  , getMerchantList, getOperateConfig, followList, isFriend, getReqDetail, customerChildren, getUserPermissionList, percentUserList, getContractList,
  getRulesUserInfo,
  getProjectMemberList,
  deleteProjectMember,
  updateProjectMember,
  operateProjectMember,
  customerImportantInfo,
  updateRatio
} from './service';


import { CustomerDetail, UserEntity, FollowListItem } from './data';
import { ConfigList, OperateConfig } from '../../commondata';
import { routerRedux } from 'dva/router';
import { CustomerQualityInspection, RequirementDataGroupDetails, CustomerLeadsListData } from '@/pages/LeadsManagement/leadsDetails/data';
import { reqListRule, createReqRule, updateReqRule, closeReqRule, openReqRule, submitComplaint, distributeCompany, turnTrueRule, customerLeadsRule } from '@/pages/LeadsManagement/leadsDetails/service';
import { CustomerDataSimple } from '@/pages/ReviewManagement/repeatDetail/data';
import { Permission, ConfigCommon } from '@/commondata';
import { XPFlowInfo } from '@/pages/DxlLeadsManagement/dxlLeadsList/data';
import { getXPFlowInfoRule, updateReqLiteRule } from '@/pages/DxlLeadsManagement/dxlLeadsList/service';
import { storeList, createOrder } from '@/pages/OrderManagement/newOrder/service';
import { Merchant } from '@/pages/OrderManagement/newOrder/data';
import { getUserLsit } from '@/pages/SunnyRulesManagement/SunnyRulesList/service';
import { any } from 'prop-types';
import { OrderDetailsModel, userlistInfoItem, contractItem } from '@/pages/OrderManagement/orderDetails/data';



export interface StateType {
  data: CustomerDetail;
  config: ConfigCommon | undefined;
  orderDetail: OrderDetailsModel | undefined;
  moneyConfig: {};
  userList: userlistInfoItem[];
  allUser: UserEntity[];
  merchantList: any;
  qualityInspection: CustomerQualityInspection[];
  customerFollowInfo: FollowListItem[];
  isFriend: boolean;
  reqGroupData: RequirementDataGroupDetails,
  permission: Permission | undefined;
  customerChildrenData: CustomerDataSimple[];
  xpFollowInfo: XPFlowInfo,
  merchantsListSinglePageData: Merchant[] | undefined,
  merchantsTotal: number,
  customerLeadsListData: CustomerLeadsListData[],
  percentUserList: any[]
  percentUserListForReqBI: any[]
  contractList: contractItem[];
  rulesUserInfo: any;
  projectMemberList:[]
  // customerPhoneDecryptText: string|undefined;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    config: Effect;
    getOrderDetails: Effect;
    searchProduct: Effect;
    bindProduct: Effect;
    updateOrder: Effect;
    getMoneyConfig: Effect;
    getGroupUserList: Effect;
    getAllUser: Effect;
    transferCustomer: Effect;
    customerManagementPage: Effect;
    startDuplicateCustomer: Effect;
    getCustomerChildren: Effect;
    getRecordList: Effect;
    getMerchantList: Effect;
    getFollowList: Effect;
    getIsFriend: Effect;
    fetchReqList: Effect;
    createReqList: Effect;
    updateReqList: Effect;
    closeReq: Effect;
    getUserPermissionList: Effect;
    openReq: Effect;
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
    // 获取用户列表
    getPercentUserList: Effect;
    //邀约BI详情项目成员用到的用户列表
    getPercentUserListForReqBI: Effect;
    getContractList: Effect;
    // 根据渠道获取用户列表
    getRulesUserInfo:Effect;
    unBindProduct: Effect;
    getProjectMemberList: Effect;
    deleteProjectMember: Effect;
    updateProjectMember: Effect;
    addProjectMember: Effect;
    // 请求查看客户重要信息
    requestCustomerImportantInfo: Effect;
    updatePercentUser: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'customerDetailMode',
  state: {
    data: {
      customerData: {},
      requirementData: {
        my: [],
        other: []
      },
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
      reqLiteData: {},
      cooperationData: [],
      reserveData: [],
    },
    orderDetail: undefined,
    config: undefined,
    moneyConfig: {},
    userList: [],
    customerFollowInfo: [],
    allUser: [],
    qualityInspection: [],
    merchantList: [],
    isFriend: false,
    reqGroupData: {
      my: [],
      other: []
    },
    // 权限
    permission: undefined,
    customerChildrenData: [],
    xpFollowInfo: {
      receive_user: [],
      distribute_company: [],
    },
    merchantsTotal: 0,
    customerLeadsListData:[],
    percentUserList:[],
    percentUserListForReqBI:[],
    contractList: [],
    rulesUserInfo:{
      into_user_list:[],
      receive_user_list:[]
    },
    projectMemberList:[],
    // customerPhoneDecryptText: undefined,
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getCustomerDetail, payload);
      yield put({
        type: 'save',
        payload: {
          data: response.data.result
        },
      });
      if (callback) callback(response.data.result)
    },
    *getOrderDetails({ payload, callback }, { call, put }) {
      const response = yield call(getOrderDetails, payload);
      yield put({
        type: 'save',
        payload: {
          orderDetail: response.data.result
        },
      });
      if (callback) callback(response.data.result)
    },
    //搜索产品
    *searchProduct({ payload, callback }, { call, put }) {
      const response = yield call(contractSearchProduct, payload);
      const productList = response.data.result.rows
      if (callback) callback(productList, response.data.result.total)
    },
    // 绑定产品
    *bindProduct({ payload, callback }, { call, put }) {
      const response = yield call(bindProductCtrl, payload);
      if (callback) callback(response.code==200)
    },
    // 绑定产品
    *updateOrder({ payload, callback }, { call, put }) {
      const response = yield call(updateOrder, payload);
      if (callback) callback(response.code==200)
    },
    // 解绑产品
    *unBindProduct({ payload, callback }, { call, put }) {
      const response = yield call(unBindProduct, payload);
      if (callback) callback(response.code==200)
    },

    * getMoneyConfig({ payload }, { call, put }) {
      const response = yield call(getMoneyConfig, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          moneyConfig: response.data.result,
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
      // arr.requirementLevel?.unshift({ id: '', name: '无' })
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
      const response = yield call(reqListRule, payload);
      yield put({
        type: 'save',
        payload: {
          reqGroupData: response.data.result,
        }
      });
    },
    *createReqList({ payload, callback }, { call, put }) {
      const response = yield call(createReqRule, payload);
      yield put({
        type: 'save',
        payload,
        callback,
      });
      if (callback) callback(response.code, response.msg);
    },
    *updateReqList({ payload, callback }, { call, put }) {
      const response = yield call(updateReqRule, payload);
      yield put({
        type: 'save',
        payload,
        callback,
      });
      if (callback) callback(response.code, response.msg);
    },
    *closeReq({ payload, callback }, { call, put }) {
      const response = yield call(closeReqRule, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload,
        callback,
      });
      if (callback) callback(response.code, response.msg);
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
    *openReq({ payload, callback }, { call, put }) {
      const response = yield call(openReqRule, payload);
      yield put({
        type: 'save',
        payload,
        callback,
      });
      if (callback) callback(response.code, response.msg);
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
    // 获取用户列表
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
    // 获取用户列表
    * getPercentUserListForReqBI({ payload }, { call, put }) {
      const response = yield call(percentUserList, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          percentUserListForReqBI: response.data.result
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

    *getProjectMemberList({ payload }, { call, put }) {
      const response = yield call(getProjectMemberList, payload);
      yield put({
        type: 'save',
        payload: {
          projectMemberList: response.data.result,
        }
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

    *deleteProjectMember({ payload, callback }, { call, put }) {
      const response = yield call(operateProjectMember, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload,
        callback,
      });
      if (callback) callback(response.code == 200, response.msg);
    },

    *updateProjectMember({ payload, callback }, { call, put }) {
      const response = yield call(operateProjectMember, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload,
        callback,
      });
      if (callback) callback(response.code, response.msg);
    },

    *addProjectMember({ payload, callback }, { call, put }) {
      const response = yield call(operateProjectMember, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload,
        callback,
      });
      if (callback) callback(response.code, response.msg);
    },
    *requestCustomerImportantInfo({ payload, callback }, { call, put }) {
      const response = yield call(customerImportantInfo, payload);
      // yield put({
      //   type: 'save',
      //   payload: {
      //     customerPhoneDecryptText: response.code == 200 ? response.data.result : undefined,
      //   }
      // });
      if(callback) {
        callback(response.code == 200, response.code == 200 ? response.data.result : undefined)
      }
    },


    *clearData({ payload }, { call, put }){
      yield put({
        type: 'save',
        payload:{
          data: {
            customerData: {},
            requirementData: {
              my: [],
              other: []
            },
            contactUserData: [],
            reqTeamData: [],
            followData: {
              showFollowButton: 0,
              showFollowProductAndCoupon: 0,
              showDistributedCompany: 0,
              distributedCompany: [],
              followTab: [],
            },
            reqLiteData: {},
            cooperationData: [],
            reserveData: [],
          },
          orderDetail: undefined,
          config: undefined,
          moneyConfig: {},
          userList: [],
          customerFollowInfo: [],
          allUser: [],
          qualityInspection: [],
          merchantList: [],
          isFriend: false,
          reqGroupData: {
            my: [],
            other: []
          },
          // 权限
          permission: undefined,
          customerChildrenData: [],
          xpFollowInfo: {
            receive_user: [],
            distribute_company: [],
          },
          merchantsTotal: 0,
          customerLeadsListData:[],
          percentUserList:[],
          percentUserListForReqBI:[],
          contractList: [],
          rulesUserInfo:{
            into_user_list:[],
            receive_user_list:[]
          },
          // customerPhoneDecryptText: undefined,
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
