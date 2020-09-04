import { XPFlowInfo, MerchantRemarkData, ThirdRecordData } from '@/pages/DxlLeadsManagement/dxlLeadsList/data';
import { getXPFlowInfoRule, updateReqLiteRule, thirdrecardsRule, merchantnotesRule } from '@/pages/DxlLeadsManagement/dxlLeadsList/service';
import { Merchant } from '@/pages/OrderManagement/newOrder/data';
import { createOrder, storeList } from '@/pages/OrderManagement/newOrder/service';
import { DistributeUser, userlistInfoItem } from '@/pages/OrderManagement/orderDetails/data';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { AnyAction, Reducer } from 'redux';
import { ConfigData, ContactInfoData, CustomerInfoData, CustomerLeadsListData, CustomerQualityInspection, FollowTime, nextLeadsIds, OrderData, RecommendMerchantData, RequirementDataGroupDetails } from './data';
import { addContactInfoRule, closeReqRule, createAssociatesRule, createReqRule, createReqTeamRule, distributeCompany, distributeUserListRule, fetchLeadDetail, followList, getConfigData, getGroupUserList, getRecordList, getUserPermissionList, isFriend, nextLeadsId, openReqRule, orderListRule, queryContactInfoRule, recommendMerchantRule, reqListRule, submitComplaint, turnTrueRule, updateCustomerInfoRule, updateReqRule, customerLeadsRule } from './service';



export interface StateType {
  customer: CustomerInfoData | undefined;
  contacts: ContactInfoData[];
  customerConfig: ConfigData;
  orderList: OrderData[],
  customerFollowInfo: FollowTime[];
  recommendMerchant: RecommendMerchantData[],
  qualityInspection: CustomerQualityInspection[],
  reqGroupData: RequirementDataGroupDetails,
  userList: userlistInfoItem[];
  nextLeadsInfo: nextLeadsIds;
  isFriend: boolean;
  distributeUserList: DistributeUser[],
  permission: any,
  xpFollowInfo: XPFlowInfo,
  merchantsListSinglePageData: Merchant[] | undefined,
  merchantsTotal: number,
  customerLeadsListData: CustomerLeadsListData[],
  merchantRemarkData: MerchantRemarkData;
  thirdRecordData: ThirdRecordData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchCustomerInfo: Effect;
    updateCustomerInfo: Effect;
    fetchContactInfo: Effect;
    addContactInfo: Effect;
    fetchOrderList: Effect;
    fetchRecommendMerchant: Effect;
    getFollowConfigInfo: Effect;
    getFollowList: Effect;
    getRecordList: Effect;
    fetchReqList: Effect;
    createReqList: Effect;
    updateReqList: Effect;
    getGroupUserList: Effect;
    getNextLeadsId: Effect;
    getIsFriend: Effect;
    distributeUserList: Effect;
    createReqTeam: Effect;
    getUserPermissionList: Effect;
    closeReq: Effect;
    openReq: Effect;
    submitComplaint: Effect;
    toComplaintDetail: Effect;
    createAssociates: Effect;
    getXPFlowInfo: Effect;
    updateReqLite: Effect;
    distributeCompany: Effect;
    getRecommendMerchants: Effect;
    submitAdvancedForm: Effect;
    turnTrue: Effect;
    fetchCustomerLeadsList: Effect;
    fetchMerchantnotes: Effect;
    fetchThirdrecards: Effect;
  };

  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'leadManagementDetail',

  state: {
    customer: undefined,
    customerConfig: {
      channel: [],
      customerLevel: [],
      leadsFollowStatus: [],
      flowStatus: [],
      identity: [],
      gender: [],
      weddingStyle: [],
      category: [],
      contactTime: [],
      contactWay: [],
      payType: [],
      requirementStatus: [],
      followTag: [],
      leadsFollowTag: [],
      photoStyle: [],
      carBrand: [],
      hotelStar: [],
      customerFollowStatus: [],
      orderFollowStatus: [],
      leadsStatus: [],
      banquetType: [],
      task: [],
      source: [],
      siteType: [],
      scheduleType: [],
      dressUseWay: [],
      dressModel: [],
      dressType: [],
      requirementReturnReason: [],
      requirementCloseReason:[],
      requirementFollowStatus: [],
      category2: [],
    },
    contacts: [],
    orderList: [],
    recommendMerchant: [],
    customerFollowInfo: [],
    qualityInspection: [],
    reqGroupData: {
      my: [],
      other: []
    },
    userList: [],
    nextLeadsInfo: {
      customer_id: '',
      leads_id: '',
    },
    isFriend: false,
    distributeUserList: [],
    // 权限
    permission: {
      callcenteradapter_getrecordlist: false,
      requirementadapter_updatereq: false,
      requirementadapter_closereq: false,
      requirementadapter_openreq: false,
      leadsadapter_transfer: false,
      recommendreq: false,
      recommendotherreq: false,
      customeradapter_updatecustomer: false,
      listenrecorder: false,
      requirementadapter_createreq: false,
      chuangjianxs: false,
    },
    xpFollowInfo: {
      receive_user: [],
      distribute_company: [],
    },
    merchantsTotal: 0,
    customerLeadsListData: [],
    merchantRemarkData: {
      list: [],
      pagination: {},
    },
    thirdRecordData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchCustomerInfo({ payload, callback }, { call, put }) {
      const response = yield call(fetchLeadDetail, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          customer: response.data.result,
        }
      });
      if (callback) {
        callback(response.data.result);
      }
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
      if (callback && response.code == 200) callback(response.data.result);
    },
    *updateReqLite({ payload, callback }, { call, put }) {
      const response = yield call(updateReqLiteRule, payload);
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
    *distributeCompany({ payload, callback }, { call, put }) {
      const response = yield call(distributeCompany, payload);
      yield put({
        type: 'save',
        payload,
      });
      if (callback) callback(response.code == 200);
    },
    *updateCustomerInfo({ payload, callback }, { call, put }) {
      const response = yield call(updateCustomerInfoRule, payload);
      yield put({
        type: 'save',
        payload,
        callback,
      });
      if (callback) callback(response.data.result);
    },
    *fetchContactInfo({ payload }, { call, put }) {
      const response = yield call(queryContactInfoRule, payload);
      yield put({
        type: 'save',
        payload: {
          contacts: response.data.result,
        }
      });
    },
    *fetchOrderList({ payload }, { call, put }) {
      const response = yield call(orderListRule, payload);
      yield put({
        type: 'save',
        payload: {
          orderList: response.data.result.rows,
        }
      });
    },
    *fetchRecommendMerchant({ payload }, { call, put }) {
      const response = yield call(recommendMerchantRule, payload);
      yield put({
        type: 'save',
        payload: {
          recommendMerchant: response.data.result,
        }
      });
    },
    *addContactInfo({ payload, callback }, { call, put }) {
      const response = yield call(addContactInfoRule, payload);
      yield put({
        type: 'save',
        payload,
        callback,
      });
      if (callback) callback(response.data.result, response.code, response.msg);
    },
    *getFollowConfigInfo({ payload, callback }, { call, put }) {
      const response = yield call(getConfigData, payload);
      yield put({
        type: 'save',
        payload: {
          customerConfig: response.data.result,
        },
        callback,
      });
      if (callback && response.code == 200) callback(response.data.result);
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
    *getRecordList({ payload }, { call, put }) {
      const response = yield call(getRecordList, payload);
      yield put({
        type: 'save',
        payload: {
          qualityInspection: response.data.result,
        }
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
    *fetchCustomerLeadsList({ payload }, { call, put }) {
      const response = yield call(customerLeadsRule, payload);
      yield put({
        type: 'save',
        payload: {
          customerLeadsListData: response.data.result,
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
    *getGroupUserList({ payload }, { call, put }) {
      const response = yield call(getGroupUserList, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          userList: response.data.result
        },
      });
    },
    *getNextLeadsId({ payload }, { call, put }) {
      const response = yield call(nextLeadsId, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          nextLeadsInfo: response.data.result
        },
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
    *distributeUserList({ payload }, { call, put }) {
      const response = yield call(distributeUserListRule, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          distributeUserList: response.data.result
        },
      });
    },
    *createReqTeam({ payload, callback }, { call, put }) {
      const response = yield call(createReqTeamRule, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload,
        callback,
      });
      if (callback) callback(response.code, response.msg);
    },
    *createAssociates({ payload, callback }, { call, put }) {
      const response = yield call(createAssociatesRule, payload);
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
    *openReq({ payload, callback }, { call, put }) {
      const response = yield call(openReqRule, payload);
      console.log(response)
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
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default Model;
