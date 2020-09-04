import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { reqPublicSea, reqDeadSea, reqDistribute, distribute,claim, getConfigRule, getUserPermissionList, getLeadStatusConfigRule, getDistributePeopleConifgRule, getDistributeGroupConifgRule, leadsDistributeRule,getRequirementList } from './service';

import { RequestListData } from './data';
import { routerRedux } from 'dva/router';
import { ConfigItem, ConfigData } from '@/pages/LeadsManagement/leadsDetails/data';
import { response } from 'express';
import { Permission } from '@/commondata';

export interface StateType {
  head1: {id:number;name:string;num:number;}[] | undefined;
  head2: {id:number;name:string;num:number;}[] | undefined;
  head3: {id:number;name:string;num:number;}[] | undefined;
  data1: RequestListData;
  data2: RequestListData;
  data3: RequestListData;
  commonConfig: ConfigData|undefined;
  distributeConfig: {
    groupConfig: ConfigItem[],
    stuffConfig: ConfigItem[]
  }|undefined;
  permission: Permission|undefined;
  // distributeGroupConifg: ConfigItem[];
  // distributePeopleConifg: ConfigItem[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchList: Effect;
    customerDetails: Effect;
    getUserPermissionList: Effect;
    getConfigInfo: Effect;
    getDistributeConifgInfos: Effect;
    // getDistributeGroupConifgInfo: Effect;
    // getDistributePeopleConifgInfo: Effect;
    doDistribute: Effect;
    doClaim: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'demandCommonSeaModel',
  state: {
    head:undefined,
    data: {
      list: [],
      pagination: {},
    },
    commonConfig: undefined,
    distributeConfig: undefined,
    permission: undefined,
    // distributeGroupConifg: [],
    // distributePeopleConifg: [],
  },

  effects: {
    *customerDetails({ payload }, { call, put }) {
      yield put(routerRedux.push({
        pathname: payload.listType==1?'/demand/demandCommonSea/demandDetails':payload.listType==2?'/demand/demandCommonDeadSea/demandDetails':payload.listType==3?'/demand/demandCommonSea/demandDetails':undefined,
        state: {
          ...payload
        },
      }));
    },
    *fetchList({ payload }, { call, put }) {
      const listType = payload.listType;
      const response = yield call(listType == 1 ? reqPublicSea : listType == 2 ? reqDeadSea : listType == 3 ? reqDistribute : reqPublicSea, payload);
      let pagination = {
        total: response.data.result.total,
        pageSize: response.data.result.page_size,
        current: payload ? payload.page : 1,
      }
      let fetchData = {
        'list': response.data.result.rows,
        'pagination': pagination,
      };
      switch(listType) {
        case 1:
          yield put({
            type: 'save',
            payload: {
              data1: fetchData,
              head1: response.data.result.head,
            }
          });
          break;
        case 2:
          yield put({
            type: 'save',
            payload: {
              data2: fetchData,
              head2: response.data.result.head,
            }
          });
          break;
        case 3: 
          yield put({
            type: 'save',
            payload: {
              data3: fetchData,
              head3: response.data.result.head,
            }
          });
          break;
      }
      
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
    *getConfigInfo({ payload }, { call, put }) {
      const response = yield call(getConfigRule, payload);
      yield put({
        type: 'save',
        payload: {
          commonConfig: response.data.result,
        }
      });
    },
    *doDistribute({payload, callback} , { call, put }) {
      const response = yield call(distribute, payload);
      yield put({
        type: 'save',
        payload: {
          commonConfig: response.data.result,
        }
      });
      if(callback) callback(response.code == 200, response.msg);
    },
    *doClaim({payload, callback} , { call, put }) {
      const response = yield call(claim, payload);
      if(callback) callback(response.code == 200);
    },
    

    // *leadsDistribute({ payload, callback }, { call, put }) {
    //   const response = yield call(leadsDistributeRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload,
    //   });
    //   if (callback) callback(response);
    // },

    *getDistributeConifgInfos({ payload, callback }, { call, put }) {
      const responseGroup = yield call(getDistributeGroupConifgRule, payload.groupPayload);
      const responseStuff = yield call(getDistributePeopleConifgRule, payload.stuffPayload);
      const distributeConfig = {
        groupConfig: responseGroup.data.result,
        stuffConfig: responseStuff.data.result,
      }
      yield put({
        type: 'save',
        payload: {
          distributeConfig
        }
      });
      if(callback) callback(responseGroup.code==200&&responseStuff.code==200, distributeConfig);
    },

    // *getDistributeGroupConifgInfo({ payload }, { call, put }) {
    //   const response = yield call(getDistributeGroupConifgRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       distributeGroupConifg: response.data.result,
    //     }
    //   });
    // },
    // *getDistributePeopleConifgInfo({ payload }, { call, put }) {
    //   const response = yield call(getDistributePeopleConifgRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       distributePeopleConifg: response.data.result,
    //     }
    //   });
    // },
    // *newReq({ payload }, { call, put }) {
    //   yield put({
    //     type: 'save',
    //     payload,
    //   });
    //   yield put(routerRedux.push('/demand/newCustomer'));
    // },
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
