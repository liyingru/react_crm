import { EffectsCommandMap } from 'dva';
import { AnyAction, Reducer } from 'redux';
import { TableListData, CompanyChannel, CompanyUser, RulesUsers, ConfigData } from './data';
import { getConfigRule, queryRule, getCompanyChannelRule, getCompanyUsersRule, externalFlowRule, internalFlowRule, getRulesUserInfoRule, getNBUsersRule } from './service';
import { getUserPermissionList } from '@/pages/LeadsManagement/leadsDetails/service';

export interface StateType {
  biData: TableListData;
  reqData: TableListData;
  biConfig: ConfigData | undefined;
  reqConfig: ConfigData | undefined;
  permission: any;
  companyChannels: CompanyChannel[];
  companyUsers: CompanyUser[];
  rulesUsers: RulesUsers | undefined;
  nbUsers: CompanyUser[];
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
    getUserPermissionList: Effect;
    getCompanyChannel: Effect;
    getCompanyUsers: Effect;
    externalFlow: Effect;
    internalFlow: Effect;
    getRulesUserInfo: Effect;
    fetchNBUsers: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'beiJingBI',
  state: {
    biData: {
      list: [],
      pagination: {},
    },
    reqData: {
      list: [],
      pagination: {},
    },
    biConfig: undefined,
    reqConfig: undefined,
    permission: {},
    companyChannels: [],
    companyUsers: [],
    rulesUsers: undefined,
    nbUsers: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryRule, payload);
      if (response.code == 200) {
        let pagination = {
          total: response.data.result.total,
          pageSize: response.data.result.pageSize,
          current: payload ? payload.page : 1,
        }
        let data = {
          'list': response.data.result.rows,
          'pagination': pagination,
        };
        if (payload.isReq) {
          yield put({
            type: 'save',
            payload: {
              reqData: data,
            }
          });
        } else {
          yield put({
            type: 'save',
            payload: {
              biData: data,
            }
          });
        }
        if (callback) callback();
      } else {
        let data = {
          list: [],
          pagination: {},
        }
        if (payload.isReq) {
          yield put({
            type: 'save',
            payload: {
              reqData: data,
            }
          });
        } else {
          yield put({
            type: 'save',
            payload: {
              biData: data,
            }
          });
        }
      }

    },
    *getConfigInfo({ payload, callback }, { call, put }) {
      const response = yield call(getConfigRule, payload);
      if (payload.isReq) {
        yield put({
          type: 'save',
          payload: {
            reqConfig: response.data.result,
          }
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            biConfig: response.data.result,
          }
        });
      }
      if (callback && response.code == 200) callback(response.data.result);
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
    *getCompanyChannel({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyChannelRule, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          companyChannels: response.data.result
        },
      });
      if (callback && response.code == 200) callback(response.data.result);
    },
    *getCompanyUsers({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyUsersRule, payload);
      yield put({
        type: 'save',
        payload: {
          companyUsers: response.data.result.rows
        },
      });
      if (callback && response.code == 200) callback(response.data.result.rows);
    },
    *getRulesUserInfo({ payload, callback }, { call, put }) {
      const response = yield call(getRulesUserInfoRule, payload);
      yield put({
        type: 'save',
        payload: {
          rulesUsers: response.data.result
        },
      });
      if (callback && response.code == 200) callback(response.data.result);
    },
    *externalFlow({ payload, callback }, { call, put }) {
      const response = yield call(externalFlowRule, payload);
      yield put({
        type: 'save',
      });
      if (callback && response.code == 200) callback(response.msg);
    },
    * internalFlow({ payload, callback }, { call, put }) {
      const response = yield call(internalFlowRule, payload);
      yield put({
        type: 'save',
      });
      if (callback && response.code == 200) callback(response.msg);
    },
    * fetchNBUsers({ payload }, { call, put }) {
      const response = yield call(getNBUsersRule, payload);
      yield put({
        type: 'save',
        payload: {
          nbUsers: response.data.result
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
