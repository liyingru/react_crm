import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';

import {
  getCustomerDetail, getCustomerConfig, transferCustomer, getAllUser, getRecordList, backToPubSea, backToDeadSea
  , getMerchantList, getOperateConfig, followList, isFriend, getReqDetail, customerChildren, getUserPermissionList, dxlQtReq, reqTeamRole,sendReqReport
} from './service';


import { CustomerDetail, UserEntity, FollowListItem } from './data';
import { ConfigList, OperateConfig } from '../../commondata';
import { routerRedux } from 'dva/router';
import { CustomerQualityInspection, RequirementDataGroupDetails, CustomerLeadsListData } from '@/pages/LeadsManagement/leadsDetails/data';
import { reqListRule, createReqRule, updateReqRule, closeReqRule, openReqRule, submitComplaint, distributeCompany, turnTrueRule, customerLeadsRule } from '@/pages/LeadsManagement/leadsDetails/service';
import { CustomerDataSimple } from '@/pages/ReviewManagement/repeatDetail/data';
import { Permission } from '@/commondata';
import { XPFlowInfo, MerchantRemarkData, ThirdRecordData } from '@/pages/DxlLeadsManagement/dxlLeadsList/data';
import { getXPFlowInfoRule, updateReqLiteRule, thirdrecardsRule, merchantnotesRule } from '@/pages/DxlLeadsManagement/dxlLeadsList/service';
import { storeList, createOrder } from '@/pages/OrderManagement/newOrder/service';
import { Merchant } from '@/pages/OrderManagement/newOrder/data';
import { getUserLsit } from '@/pages/SunnyRulesManagement/SunnyRulesList/service';



export interface StateType {
  data: CustomerDetail;
  config: ConfigList;
  allUser: UserEntity[];
  merchantList: any;
  qualityInspection: CustomerQualityInspection[];
  customerFollowInfo: FollowListItem[];
  isFriend: boolean;
  reqGroupData: RequirementDataGroupDetails,
  permission: Permission | {};
  customerChildrenData: CustomerDataSimple[];
  xpFollowInfo: XPFlowInfo,
  merchantsListSinglePageData: Merchant[] | undefined,
  merchantsTotal: number,
  customerLeadsListData: CustomerLeadsListData[],
  teamRole:any;
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
    fetch: Effect;
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
    dxlQtReq: Effect;
    getTeamRole: Effect;
    fetchMerchantnotes: Effect;
    fetchThirdrecards: Effect;
    sendReq:Effect;
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
    config: {
      channel: [], //渠道
      customerLevel: [], //客户级别
      identity: [], //客户身份
      gender: [], //性别
      weddingStyle: [], //婚礼风格
      category: [], //业务品类
      contactTime: [], //方便联系时间
      contactWay: [], //跟进方式
      payType: [], //付款方式
      requirementStatus: [], //有效单状态
      followTag: [], //跟进标签
      leadsFollowStatus: [], //客资跟进状态
      customerFollowStatus: [], //客户跟进状态
      orderFollowStatus: [], //订单跟进状态
      leadsStatus: [], //客资状态
      banquetType: [], //婚宴类型
      carBrand: [], //车辆品牌
      photoStyle: [], //婚照风格
      hotelStar: [], //酒店星级
      source: [], //活动来源
      category2: [],
      customerStatus: [],
      coupon: [],
      requirementReturnReason: [],
      dressModel: [],
      dressType: [],
      siteType: [],
      scheduleType: [],
      dressUseWay: [],
      customerRepeatStatus: [],// 合并标识
      complaintType: [], // 客诉类型
    },
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
    permission: {},
    customerChildrenData: [],
    xpFollowInfo: {
      receive_user: [],
      distribute_company: [],
    },
    merchantsTotal: 0,
    customerLeadsListData:[],
    teamRole:[],
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
          allUser: response.data.result
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

    *dxlQtReq({ payload, callback }, { call, put }) {
      const response = yield call(dxlQtReq, payload);
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

    *getTeamRole({ payload }, { call, put }) {
      const response = yield call(reqTeamRole, payload);
      yield put({
        type: 'save',
        payload: {
          teamRole: response?.data?.result?.info,
        }
      });
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
          config: {
            channel: [], //渠道
            customerLevel: [], //客户级别
            identity: [], //客户身份
            gender: [], //性别
            weddingStyle: [], //婚礼风格
            category: [], //业务品类
            contactTime: [], //方便联系时间
            contactWay: [], //跟进方式
            payType: [], //付款方式
            requirementStatus: [], //有效单状态
            followTag: [], //跟进标签
            leadsFollowStatus: [], //客资跟进状态
            customerFollowStatus: [], //客户跟进状态
            orderFollowStatus: [], //订单跟进状态
            leadsStatus: [], //客资状态
            banquetType: [], //婚宴类型
            carBrand: [], //车辆品牌
            photoStyle: [], //婚照风格
            hotelStar: [], //酒店星级
            source: [], //活动来源
            category2: [],
            customerStatus: [],
            coupon: [],
            requirementReturnReason: [],
            dressModel: [],
            dressType: [],
            siteType: [],
            scheduleType: [],
            dressUseWay: [],
            customerRepeatStatus: [],// 合并标识
            complaintType: [], // 客诉类型
          },
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
          permission: {},
          customerChildrenData: [],
          xpFollowInfo: {
            receive_user: [],
            distribute_company: [],
          },
          merchantsTotal: 0,
          customerLeadsListData:[],
          teamRole:[],
        }
      })
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
    *sendReq({ payload, callback }, { call, put }) {
      const response = yield call(sendReqReport, payload);
      yield put({
        type: 'save',
        payload,
      });
      if (callback) callback(response);
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
};

export default Model;
