import { DistributeUser, userlistInfoItem } from '@/pages/OrderManagement/orderDetails/data';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { AnyAction, Reducer } from 'redux';
import { ConfigData, ConfigItem, ContactInfoData, CustomerInfoData, CustomerQualityInspection, FollowTime, nextLeadsIds, OrderData, RecommendMerchantData, RequirementDataGroupDetails, CustomerLeadsDatas, CustomerLeadsListData } from '../../LeadsManagement/leadsDetails/data';
import { closeReqRule, createAssociatesRule, createReqRule, createReqTeamRule, distributeUserListRule, fetchLeadDetail, followList, getConfigData, getGroupUserList, getRecordList, getUserPermissionList, openReqRule, orderListRule, queryContactInfoRule, recommendMerchantRule, reqListRule, submitComplaint, updateCustomerInfoRule, updateReqRule, customerLeadsRule, isFriend } from '../../LeadsManagement/leadsDetails/service';
import { TableListData, XPFlowInfo, MerchantRemarkData, ThirdRecordData } from './data';
import { getConfigRule, getLeadStatusConfigRule, queryRule, getXPFlowInfoRule, getDistributePeopleConifgRule, merchantnotesRule, thirdrecardsRule } from './service';



export interface StateType {
  data: TableListData;
  merchantRemarkData: MerchantRemarkData;
  thirdRecordData: ThirdRecordData;
  customerConfig: ConfigData | undefined;
  leadStatusConfig: ConfigItem[];
  customer: CustomerInfoData | undefined;
  contacts: ContactInfoData[];
  orderList: OrderData[],
  customerFollowInfo: FollowTime[] | undefined;
  recommendMerchant: RecommendMerchantData[],
  qualityInspection: CustomerQualityInspection[],
  reqGroupData: RequirementDataGroupDetails,
  userList: userlistInfoItem[];
  nextLeadsInfo: nextLeadsIds;
  isFriend: boolean;
  distributeUserList: DistributeUser[],
  permission: any,
  xpFollowInfo: XPFlowInfo,
  customerLeadsListData: CustomerLeadsListData[],
  distributePeopleConifg: ConfigItem[];
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
    getConfigInfo: Effect;
    getLeadStatusConfigInfo: Effect;
    fetchCustomerInfo: Effect;
    updateCustomerInfo: Effect;
    fetchContactInfo: Effect;
    fetchOrderList: Effect;
    fetchRecommendMerchant: Effect;
    getFollowConfigInfo: Effect;
    getFollowList: Effect;
    getRecordList: Effect;
    fetchReqList: Effect;
    fetchCustomerLeadsList: Effect;
    createReqList: Effect;
    updateReqList: Effect;
    getGroupUserList: Effect;
    distributeUserList: Effect;
    createReqTeam: Effect;
    getUserPermissionList: Effect;
    closeReq: Effect;
    openReq: Effect;
    submitComplaint: Effect;
    toComplaintDetail: Effect;
    createAssociates: Effect;
    getIsFriend: Effect;
    newCustomer: Effect;
    getXPFlowInfo: Effect;
    getDistributePeopleConifgInfo: Effect;
    fetchMerchantnotes: Effect;
    fetchThirdrecards: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'dxlLeadsManagementAndsearchAndLeadTableList',
  state: {
    data: {
      list: [],
      pagination: {},
      all_task: "",
      done_task: "",
      todo_task: "",
      color_status: "0",
    },
    merchantRemarkData: {
      list: [],
      pagination: {},
    },
    thirdRecordData: {
      list: [],
      pagination: {},
    },
    customerConfig: undefined,
    leadStatusConfig: [],
    customer: undefined,
    contacts: [],
    orderList: [],
    recommendMerchant: [],
    customerFollowInfo: undefined,
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
    permission: {
      callcenteradapter_getrecordlist: false,
      requirementadapter_updatereq: false,
      requirementadapter_closereq: false,
      requirementadapter_openreq: false,
      closeotherreq: false,
      openotherreq: false,
      editotherreq: false,
      viewotherreq: false,
      recommendotherreq: false,
      customeradapter_updatecustomer: false,
      listenrecorder: false,
      requirementadapter_createreq: false,
      chuangjianxs: false,
      owneridfilter: false,
    },
    xpFollowInfo: {
      receive_user: [],
      distribute_company: [],
    },
    customerLeadsListData:[],
    distributePeopleConifg: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryRule, payload);
      if (response.code == 200) {
        let pagination = {
          total: response.data.result.count,
          pageSize: response.data.result.page_size,
          current: payload ? payload.page : 1,
        }
        let fetchData = {
          'list': response.data.result.data,
          'pagination': pagination,
          'all_task': response.data.result.all_task,
          'done_task': response.data.result.done_task,
          'todo_task': response.data.result.todo_task,
          'color_status': response.data.result.color_status,
        };
        console.log(fetchData);
        yield put({
          type: 'save',
          payload: {
            data: fetchData,
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
            data: data,
          }
        });
      }

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
    *getConfigInfo({ payload, callback }, { call, put }) {
      const response = yield call(getConfigRule, payload);
      yield put({
        type: 'save',
        payload: {
          customerConfig: response.data.result,
        }
      });
      if (callback && response.code == 200) callback(response.data.result);
    },
    *getLeadStatusConfigInfo({ payload, callback }, { call, put }) {
      const response = yield call(getLeadStatusConfigRule, payload);
      yield put({
        type: 'save',
        payload: {
          leadStatusConfig: response.data.result,
        }
      });
      if (callback) callback(response);
    },
    *fetchCustomerInfo({ payload, callback }, { call, put }) {
      const response = yield call(fetchLeadDetail, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          customer: response.data.result,
        },
        callback,
      });
      if (callback) callback(response.code, response.data.result);
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
    *getFollowConfigInfo({ payload }, { call, put }) {
      const response = yield call(getConfigData, payload);
      yield put({
        type: 'save',
        payload: {
          customerConfig: response.data.result,
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
    //新建客资
    *newCustomer({ payload }, { call, put }) {
      yield put(routerRedux.push({
        pathname: '/leads/dxlLeadsManagement/newCustomer',
        query: {
          fromTag: 'dxlLeads',
        }
      }));
    },
    *getDistributePeopleConifgInfo({ payload }, { call, put }) {
      const response = yield call(getDistributePeopleConifgRule, payload);
      yield put({
        type: 'save',
        payload: {
          distributePeopleConifg: response.data.result,
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
