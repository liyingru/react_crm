import { AnyAction ,Reducer} from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { createOrder,initData,initDataName ,transferOrdersCtrl,getCustomerByPhoneFn, search, customerDetailById, customerList, reqList, hotelList, weddingList, hunqingList, storeList, contractSearchProduct, getRecommendCompanys, getProductList, claimOrder, orderList } from './service';
import { TableListData,ConfigState,getCustomerName , CustomerLisItem, Merchant, OrderLisItem } from './data';
import { routerRedux } from 'dva/router';
import { RequirementData } from '@/pages/LeadsManagement/leadsDetails/data';
import { productInfo } from '../../OrderManagement/newContractNew/data';
export interface StateType {
  data: TableListData;
  orderNum: string|undefined|false,
  customerListSinglePageData: OrderLisItem[]|undefined,
  customersTotal: number,
}
export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    claimOrder: Effect;
    search:Effect;
    orderManagementPage:Effect;
    reset:Effect;
    newCustomer:Effect;
    
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'getOrderAndOrderList',

  state: {
    data: {
      list: [],
    },
    orderNum: undefined,
    customerListSinglePageData: undefined,
    customersTotal: 0,
  },

  effects: {

    *search({ payload,callback }, { call,put }) {
      console.log("参数： " + payload);
      let response = yield call(orderList, payload);
      yield put({
        type: 'save',
        payload:{customerListSinglePageData :response.data.result && response.data.result != null ? response.data.result : [], 
          customersTotal: response.data.result ?  response.data.result.length : 0},
        callback
      });
      if(callback)callback(response.code == 200, response.msg)
    },
    *claimOrder({ payload,callback }, { call,put }) {
      let response = yield call(claimOrder, payload);
      if(callback)callback(response.code == 200, response.data.result.customerData)
    },



    *orderManagementPage({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload,
      });
      yield put(routerRedux.push('/saleManagement/saleList'));
    },



    *reset({payload}, { put }) {
      yield put({
        type: 'save',
        payload:{
          // customerList: undefined,
          // reqList: undefined,
          // merchantsList: undefined,
          orderNum: false,
        },
      });
    },
    *newCustomer({ payload }, { call, put }) {
      yield put(routerRedux.push('/demand/newCustomer'));
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
