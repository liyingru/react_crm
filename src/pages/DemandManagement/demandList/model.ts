import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addRule, queryRule, removeRule, updateRule,updateReqLiteCtrl, getConfigRule,getUserPermissionListCtrl, getLeadStatusConfigRule, getDistributePeopleConifgRule, getDistributeGroupConifgRule, leadsDistributeRule,getRequirementList, getQtRequirementList, getAllRequirementList } from './service';

import { TableListData } from './data';
import { routerRedux } from 'dva/router';
import { ConfigItem, ConfigData } from '@/pages/LeadsManagement/leadsDetails/data';
import { reqDistribute } from '../demandCommonSea/service';
import { Permission } from '@/commondata';

export interface StateType {
  dataMy: TableListData;
  dataQa: TableListData;
  dataAll: TableListData;
  customerConfig: ConfigData;
  leadStatusConfig: ConfigItem[];
  distributeGroupConifg: ConfigItem[];
  distributePeopleConifg: ConfigItem[];
  permission: Permission;
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
    add: Effect;
    remove: Effect;
    update: Effect;
    details: Effect;
    customerDetails: Effect;
    getConfigInfo: Effect;
    getLeadStatusConfigInfo: Effect;
    getDistributeGroupConifgInfo: Effect;
    getDistributePeopleConifgInfo: Effect;
    leadsDistribute: Effect;
    newReq: Effect;
    getUserPermissionList:Effect;
    updateReqLiteCtrlReq:Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'demandManagement',
  state: {
    dataMy: {
      list: [],
      pagination: {},
    },
    dataQa: {
      list: [],
      pagination: {},
    },
    dataAll: {
      list: [],
      pagination: {},
    },
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
      requirementFollowTag:[],
      photoStyle: [],
      carBrand: [],
      hotelStar: [],
      customerFollowStatus: [],
      requirementFollowStatus:[],
      orderFollowStatus: [],
      leadsStatus: [],
      banquetType: [],
      task: [],
      source: [],
      category2: [],
      requirementPhase:[],
      weddingDateTag:[],
      isArrival:[],
    },
    leadStatusConfig: [],
    distributeGroupConifg: [],
    distributePeopleConifg: [],
    permission:{}
  },

  effects: {
    *getUserPermissionList({ payload }, { call, put }) {
      const response = yield call(getUserPermissionListCtrl, payload);
      yield put({
        type: 'save',
        payload: {
          permission: response.data.result
        },
      });
    },
    *updateReqLiteCtrlReq({ payload,callback }, { call, put }) {
      const response = yield call(updateReqLiteCtrl, payload);
      if(callback)callback(response)
     
    },

    *details({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload,
      });
      const customerId = payload.customerId;
      const leadId = payload.leadId;
      const saveParams = payload.saveParams;
      yield put(routerRedux.push({
        pathname: '/leads/leadsManagement/leadsDetails',
        state: {
          customerId: customerId,
          leadId: leadId,
          saveParams: saveParams,
        },
      }));
    },
    *customerDetails({ payload }, { call, put }) {
      const listType : 0 | 1 | 2  = payload.listType;
      yield put(routerRedux.push({
        pathname: listType == 0 ? '/demand/demandManagement/demandDetails' : listType == 1 ? '/demand/demandsQaList/demandDetails' : listType == 2 ? '/demand/demandListAll/demandDetails' : '/demand/demandManagement/demandDetails',
        state: {
          ...payload
        },
      }));
    },
    *fetch({ payload }, { call, put }) {
      let listType = payload.listType
      delete payload['listType']
      const response = yield call(listType == 1 ? getQtRequirementList :listType == 2 ? getAllRequirementList : getRequirementList, payload);
      let pagination = {
        total: response.data.result.total,
        pageSize: response.data.result.page_size,
        current: payload ? payload.page : 1,
      }
      let fetchData = {
        'list': response.data.result.rows,
        'pagination': pagination,
      };
      if(listType == 1){
        yield put({
          type: 'save',
          payload: {
            dataQa: fetchData,
          }
        });
      } else if(listType == 2){
        yield put({
          type: 'save',
          payload: {
            dataAll: fetchData,
          }
        });
      } else if(listType == 0){
        yield put({
          type: 'save',
          payload: {
            dataMy: fetchData,
          }
        });
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *getConfigInfo({ payload }, { call, put }) {
      const response = yield call(getConfigRule, payload);
      let arr = response.data.result
      arr.requirementPhase.push({ id: "", name: '全部' })
      yield put({
        type: 'save',
        payload: {
          customerConfig: arr,
        }
      });
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
    *leadsDistribute({ payload, callback }, { call, put }) {
      const response = yield call(leadsDistributeRule, payload);
      yield put({
        type: 'save',
        payload,
      });
      if (callback) callback(response);
    },
    *getDistributeGroupConifgInfo({ payload }, { call, put }) {
      const response = yield call(getDistributeGroupConifgRule, payload);
      yield put({
        type: 'save',
        payload: {
          distributeGroupConifg: response.data.result,
        }
      });
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
    *newReq({ payload }, { call, put }) {
      yield put(routerRedux.push( {
        pathname: '/demand/demandManagement/newCustomer',
        query: {
          fromTag: 'demand',
        }
      }));
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
