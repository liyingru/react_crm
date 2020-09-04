import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getBalanceList, getConfig } from './service';
import { DistributeListData, SimpleCompany } from './data';
import { ConfigListItem } from '@/pages/CustomerManagement/customerList/data';
import { ConfigList } from '@/pages/CustomerManagement/commondata';
import { SystemUser } from '@/pages/DashboardWorkplace/data';


export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getBalanceList: Effect;
    getConfig: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

export interface StateType {
  data: DistributeListData
  configData: ConfigList,
  userList: {user_id: string, name: string}[];
  companyList: SimpleCompany[];
}

const Model: ModelType = {
  namespace: 'sunnyDistributeListModel',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    
  },
  effects: {
    *getBalanceList({ payload }, { call, put }) {
      if (payload == undefined) {
        payload = {}
      }
      payload.page = payload.page || 1
      payload.pageSize = payload.pageSize || 10
      const response = yield call(getBalanceList, payload);
      yield put({
        type: 'save',
        payload: {
          data: {
            list: response.data.result.rows,
            pagination: {
              total: response.data.result.total,
              pageSize: response.data.result.page_size || payload.pageSize,
              current: payload ? payload.page : 1,
            }
          }
        },
      });
    },
    *getConfig({ payload }, { call, put }) {
      const response = yield call(getConfig, payload);
      let arr = response.data.result
      yield put({
        type: 'save',
        payload: {
          configData: arr
        },
      })
    },

    
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },

};

export default Model;

