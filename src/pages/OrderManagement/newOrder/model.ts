import { AnyAction ,Reducer} from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { createOrder,initData,initDataName ,transferOrdersCtrl,getCustomerByPhoneFn, search, customerDetailById, customerList, reqList, hotelList, weddingList, hunqingList, storeList, contractSearchProduct, getRecommendCompanys, getProductList } from './service';
import { TableListData,ConfigState,getCustomerName , CustomerLisItem, Merchant } from './data';
import { routerRedux } from 'dva/router';
import { RequirementData } from '@/pages/LeadsManagement/leadsDetails/data';
import { productInfo } from '../newContractNew/data';
export interface StateType {
  data: TableListData;
  configData:ConfigState|'';
  getCustomerName:'',
  transferOrdersData:'',
  reqList:RequirementData[]|undefined,
  merchantsListSinglePageData: Merchant[]|undefined,
  productsListSinglePageData: productInfo[]|undefined,
  companysList: {id:string, name:string}[],
  orderNum: string|undefined|false,
  customerListSinglePageData: CustomerLisItem[]|undefined,
  customersTotal: number,
  merchantsTotal: number,
  productsTotal: number,
}
export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submitAdvancedForm: Effect;
    initDataCtrl:Effect;
    getCustomerNameCtrl:Effect;
    search: Effect;
    transferOrders:Effect;
    orderManagementPage:Effect;
    getCustomerByPhoneCtrl:Effect;
    customerList: Effect;
    reqList: Effect;
    getRecommendMerchants: Effect;
    reset: Effect;
    newCustomer: Effect;
    customerDetailById: Effect;
    searchProduct: Effect;
    getRecommendCompanys: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'newOrderAndOrderTableList',

  state: {
    data: {
      list: [],
    },
    configData:'',
    getCustomerName:'',
    transferOrdersData:'',
    reqList: undefined,
    merchantsListSinglePageData: undefined,
    productsListSinglePageData: undefined,
    orderNum: undefined,
    customerListSinglePageData: undefined,
    customersTotal: 0,
    merchantsTotal: 0,
    productsTotal: 0,
    companysList:[],
  },

  effects: {
    *submitAdvancedForm({ payload,callback }, { call, put }) {
      let response = yield call(createOrder, payload);
      if(response.code == 200) {
        yield put({
          type: 'save',
          payload:{orderNum :response.data.result},
        });
      }
      if (callback) callback(response.code == 200,response.msg);
    },
    *initDataCtrl({ payload }, { call,put }) {
      let response = yield call(initData, payload);
      yield put({
        type: 'save',
        payload:{configData :response.data.result},
      });
    },
    *getCustomerNameCtrl({ payload,callback }, { call,put }) {
      let response = yield call(initDataName, payload);
      yield put({
        type: 'save',
        payload:{getCustomerName :response.data.result},
        callback
      });
      if(callback)callback(response)
    },
    //通过手机号查询客户
    *getCustomerByPhoneCtrl({ payload,callback }, { call,put }) {
      let response = yield call(getCustomerByPhoneFn, payload);
      yield put({
        type: 'save',
        payload:{getCustomerName :response.data.result},
        callback
      });
      if(callback)callback(response)
    },
    *search({ payload,callback }, { call,put }) {
      console.log("参数： " + payload);
      let response = yield call(search, payload);
      yield put({
        type: 'save',
        payload:{customerListSinglePageData :response.data.result && response.data.result != null ? response.data.result : [], 
        customersTotal: response.data.result && response.data.result.total ? response.data.result.total : response.data.result ? response.data.result.length : 0},
        callback
      });
      if(callback)callback(response.code == 200, response.msg)
    },
    *customerDetailById({ payload,callback }, { call,put }) {
      let response = yield call(customerDetailById, payload);
      if(callback)callback(response.code == 200, response.data.result.customerData)
    },

    *transferOrders({ payload,callback }, { call,put }) {
      let response = yield call(transferOrdersCtrl, payload);
      yield put({
        type: 'save',
        payload:{transferOrdersData :response.data.result},
        callback
      });
      if(callback)callback(response)
    },

    *orderManagementPage({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload,
      });
      yield put(routerRedux.push('/order/orderManagement'));
    },

    *customerList({ payload,callback }, { call,put }) {
      let response = yield call(customerList, payload);
      yield put({
        type: 'save',
        payload:{customerList :response.data.result.rows}
      });
      if(callback)callback(response)
    },
    *reqList({ payload,callback }, { call,put }) {
      let response = yield call(reqList, {
        ...payload,
        page: 1,
        pageSize: 100
      });
      yield put({
        type: 'save',
        payload:{reqList :response.data.result.rows},
        callback
      });
      if(callback)callback(response)
    },
    *getRecommendMerchants({ payload,callback }, { call,put }) {

      const response = yield call(storeList, payload);
      // let response;
      // if(payload.category == '1') { // 婚宴
      //   response = yield call(hotelList, payload);
      // } else if (payload.category == '2') { // 婚庆
      //   response = yield call(hunqingList, payload);
      // }  else if (payload.category == '3') { // 婚纱摄影、旅拍
      //   response = yield call(weddingList, payload);
      // } else { // 其他品类
      //   response = yield call(storeList, payload);
      // }
      
      yield put({
        type: 'save',
        payload:{merchantsListSinglePageData :response.data.result.rows, merchantsTotal: response.data.result.total},
        callback
      });
      if(callback)callback(response)
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
  //搜索产品
  *searchProduct({ payload,callback}, { call, put }) {
    // const response = yield call(contractSearchProduct, payload);
    const response = yield call(getProductList, payload);
    const productsListSinglePageData = response.data.result.rows
    const total = (response.data.result.total);
    yield put({
      type: 'save',
      payload: {
        productsListSinglePageData,
        productsTotal:total
      },
      callback
    });
    if(callback)callback(response.code == 200, response.msg)
  },

  //可派发的公司列表
  *getRecommendCompanys({ payload,callback}, { call, put }) {
    const response = yield call(getRecommendCompanys, payload);
    const companysList = response.data.result.distribute_company;
    yield put({
      type: 'save',
      payload: {
        companysList
      }
    });
    if(callback)callback(response.code == 200)
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
