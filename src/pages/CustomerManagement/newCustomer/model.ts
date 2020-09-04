import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { fakeSubmitForm, createCustomer, transferCustomer, createReq, createLeads } from './service';
import { routerRedux } from 'dva/router';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    submitRegularForm: Effect;
    addLeads: Effect;
    createReq: Effect;
    transferCustomer:Effect
    demandManagementPage:Effect
    customerManagementPage:Effect
    router: Effect
  };
}
const Model: ModelType = {
  namespace: 'customerManagement',

  state: {},

  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },

    //新建线索
    *addLeads({ payload, callback }, { call }) { 
      const response =  yield call(createLeads, payload); 
      const value = response.data.result
      if (callback) callback(response.code == 200,response.msg,value);
      },  
      //创建有效单
    *createReq({ payload, callback }, { call }) { 
								const response =  yield call(createReq, payload); 
								const customer_id = response.data.result.customerId;
        if (callback) callback(response.code == 200,response.msg,customer_id);
      },

      //转让客户给同事
      *transferCustomer({ payload, callback  }, { call }) { 
        const response =  yield call(transferCustomer, payload); 
        if (callback) callback(response.code == 200,response.msg);
      },

      //有效单列表管理
      *demandManagementPage({ payload }, { call, put }) {
        yield put({
          type: 'save',
          payload,
        });
        yield put(routerRedux.push('/demand/demandManagement'));
      },

        //客户列表管理
        *customerManagementPage({ payload }, { call, put }) {
          yield put({
            type: 'save',
            payload,
          });
          yield put(routerRedux.push('/customer/customerManagement'));
        },

      *router({ payload }, { call, put }) {
        yield put(routerRedux.push({
          pathname: payload.pathname,
          state: {
            ...payload.params
          },
        }));
      },
  
    },
  };

export default Model;
