import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { fakeSubmitForm, createLeads, transferLeads } from './service'; 
import { routerRedux } from 'dva/router';
import { getDistributePeopleConifgRule } from '@/pages/SaleManagement/saleList/service';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface StateType {
  distributePeopleConifg:any;
}


export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    addLeads: Effect;
    transferLeads: Effect;
    leadsManagementPage: Effect;
    dxlLeadsManagementPage: Effect;
    customerManagementPage: Effect;
    getDistributePeopleConifgInfo: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}
const Model: ModelType = {
  namespace: 'leadsManagement',

  state: {
    distributePeopleConifg:[],
  },

  effects: {
      //新建线索
      *addLeads({ payload, callback }, { call }) { 
        const response =  yield call(createLeads, payload); 
        const value = response.data.result
        if (callback) callback(response.code == 200,response.msg,value);
      },

      //转让线索给同事
      *transferLeads({ payload, callback  }, { call }) { 
        const response =  yield call(transferLeads, payload); 
        if (callback) callback(response.code == 200,response.msg,'');
      },    

      *leadsManagementPage({ payload }, { call, put }) {
        yield put({
          type: 'save',
          payload,
        });
        yield put(routerRedux.push('/leads/leadsManagement'));
      },

      *dxlLeadsManagementPage({ payload }, { call, put }) {
        yield put({
          type: 'save',
          payload,
        });
        yield put(routerRedux.push('/leads/dxlLeadsManagement'));
      },

      //客户列表管理
      *customerManagementPage({ payload }, { call, put }) {
        yield put({
          type: 'save',
          payload,
        });
        yield put(routerRedux.push('/customer/customerManagement'));
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
