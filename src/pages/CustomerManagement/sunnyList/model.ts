import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getCustomerList, getCustomerConfig, getCustomerFields, getMessageConfig, getUserPermissionList, batchUpdateCustomer, queryUsersList, searchUserList, transferCustomerLeads, transferCustomerReq } from './service';

import { CustomerListData, CustomerField } from './data';
import { routerRedux } from 'dva/router';
import { ConfigList } from '../commondata';
import { Permission } from '@/commondata';

export interface StateType {
  dataRecorder: CustomerListData | undefined;
  dataLeads: CustomerListData | undefined;
  dataReqs: CustomerListData | undefined;
  config: ConfigList;
  fields: CustomerField[];
  permission: Partial<Permission>;
  roleData: any;
  searchUserData: any;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  temp: any;
  state: StateType;
  effects: {
    fetch: Effect;
    config: Effect;
    fields: Effect;
    router: Effect;
    startDuplicateCustomer: Effect;
    getMessageConfigHandel: Effect;
    getUserPermissionList: Effect;
    batchUpdateCustomer: Effect;
    fetchRole: Effect;
    getSearchUserData: Effect;
    transferCustomerLeads: Effect;
    transferCustomerReq: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'sunnyListMode',

  temp: {},

  state: {
    data: undefined,
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
      requirementFollowTag: [],
      leadsFollowStatus: [], //客资跟进状态
      customerFollowStatus: [], //客户跟进状态
      orderFollowStatus: [], //订单跟进状态
      leadsStatus: [], //客资状态
      banquetType: [], //婚宴类型
      carBrand: [], //车辆品牌
      photoStyle: [], //婚照风格
      hotelStar: [], //酒店星级
      source: [], //活动来源
      category2: [], //多级业务品类
    },
    fields: [],
    messageConfig: [],
    permission: {},
    roleData: [],
    searchUserData: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      if (payload == undefined) {
        payload = {}
      }
      const roleType: number = payload.type;
      payload.page = payload.page || 1
      payload.pageSize = payload.pageSize || 20
      const response = yield call(getCustomerList, payload);
      if (roleType == 1) {
        yield put({
          type: 'save',
          payload: {
            dataLeads: {
              list: response.data.result.rows,
              pagination: {
                total: response.data.result.total,
                pageSize: response.data.result.page_size || payload.pageSize,
                current: payload ? payload.page : 1,
              }
            }
          },
        });
      } else if (roleType == 2) {
        yield put({
          type: 'save',
          payload: {
            dataReqs: {
              list: response.data.result.rows,
              pagination: {
                total: response.data.result.total,
                pageSize: response.data.result.page_size || payload.pageSize,
                current: payload ? payload.page : 1,
              }
            }
          },
        });
      } if (roleType == 4) {
        yield put({
          type: 'save',
          payload: {
            dataRecorder: {
              list: response.data.result.rows,
              pagination: {
                total: response.data.result.total,
                pageSize: response.data.result.page_size || payload.pageSize,
                current: payload ? payload.page : 1,
              }
            }
          },
        });
      }
    },
    *config({ payload }, { call, put }) {
      const response = yield call(getCustomerConfig, payload);
      let arr = response.data.result
      arr.requirementFollowTag.unshift({ id: '', name: '全部' })
      yield put({
        type: 'save',
        payload: {
          config: arr
        },
      })
    },
    //客户重复，发起重单
    *startDuplicateCustomer({ payload }, { call, put }) {
      yield put(routerRedux.push({
        pathname: '/customer/customerManagement/startDuplicateCustomer',
        state: {
          customerData: undefined,
        },
      }));
    },

    *fields({ params }, { call, put }) {
      const response = yield call(getCustomerFields, params);
      yield put({
        type: 'save',
        payload: {
          fields: response.data.result
        },
      })
    },

    *getMessageConfigHandel({ payload }, { call, put }) {
      const response = yield call(getMessageConfig, payload);
      yield put({
        type: 'save',
        payload: {
          messageConfig: response.data.result
        },
      })
    },

    *getUserPermissionList({ payload }, { call, put }) {
      const response = yield call(getUserPermissionList, payload);
      yield put({
        type: 'save',
        payload: {
          permission: response.data.result
        },
      });
    },

    *batchUpdateCustomer({ payload, callback }, { call, put }) {
      const response = yield call(batchUpdateCustomer, payload);
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
    *fetchRole({ payload }, { call, put }) {
      const response = yield call(queryUsersList, payload);
      if (response.code == 200) {
        yield put({
          type: 'save',
          payload: {
            roleData: response.data.result.rows
          }
        })
      }
    },
    *getSearchUserData({ payload }, { call, put }) {
      const response = yield call(searchUserList, payload);
      yield put({
        type: 'save',
        payload: {
          searchUserData: response.data.result,
        }
      });
    },
    *transferCustomerLeads({ payload, success }, { call, put }) {
      const response = yield call(transferCustomerLeads, payload);
      if (success && response.code == 200) success();
    },
    *transferCustomerReq({ payload, success }, { call, put }) {
      const response = yield call(transferCustomerReq, payload);
      if (success && response.code == 200) success();
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
