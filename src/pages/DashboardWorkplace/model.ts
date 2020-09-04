import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { CurrentUser, SystemUser, BossSea, WorkPanel, WorkNumbersType, MyPerformance, SalesAssistant, SalesPerformance, ForecastPerformance, HonorUser, ReqrankingUser, OrderrankingUser, SalesFunnel, ApprovalCenterOrder, CallAnalysis } from './data.d';
import {
  getBossSea,
  setBossSea,
  getWorkList,
  setWorkList,
  workbenchNums,
  queryCompanyList,
  queryStructureList,
  queryUsersList,
  queryMyPerformance,
  querySalesAssistant,
  querySalesPerformance,
  queryForecastPerformance,
  queryHonorList,
  queryReqrankingList,
  queryOrderrankingList,
  querySalesFunnel,
  queryApprovalCenter,
  queryCallAnalysis
} from './service';
import { fn } from 'moment';

export interface ModalState {
  currentUser: Partial<CurrentUser>;
  companyList: [];
  structureList: [];
  userList: SystemUser[];

  bossSeaList: BossSea[];
  workPaneList: WorkPanel[];
  workBenchNums: Partial<WorkNumbersType>;
  myPerformance: Partial<MyPerformance>;
  salesAssistant: Partial<SalesAssistant>;
  salesPerformance: Partial<SalesPerformance>;
  forecastPerformance: Partial<ForecastPerformance>;
  honorList: HonorUser[];
  reqrankingList: ReqrankingUser[];
  orderrankingList: OrderrankingUser[];
  salesFunnel: Partial<SalesFunnel>;
  approvalCenterOrderList: ApprovalCenterOrder[];
  callAnalysisNormal: Partial<CallAnalysis>;
  callAnalysisDialout: Partial<CallAnalysis>;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ModalState) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: ModalState;
  reducers: {
    save: Reducer<ModalState>;
    clear: Reducer<ModalState>;
  };
  effects: {
    init: Effect;
    fetchAll: Effect;
    fetchCompanyList: Effect;
    fetchStructureList: Effect;
    fetchUsersList: Effect;

    setBossSeaList: Effect;
    fetchBossSeaList: Effect;
    setWorkPanelList: Effect;
    fetchWorkPanelList: Effect;
    fetchWorkbenchNums: Effect;
    fetchMyPerformance: Effect;
    fetchSalesAssistant: Effect;
    fetchSalesPerformance: Effect;
    fetchForecastPerformance: Effect;
    fetchHonorList: Effect;
    fetchReqrankingList: Effect;
    fetchOrderrankingList: Effect;
    fetchSalesFunnel: Effect;
    fetchApprovalCenter: Effect;
    fetchCallAnalysis: Effect;

  };
}

const Model: ModelType = {
  namespace: 'dashboardWorkplace',
  state: {
    currentUser: {},
    companyList: [],
    structureList: [],
    userList: [],

    bossSeaList: [],
    workPaneList: [],
    workBenchNums: {},
    myPerformance: {},
    salesAssistant: {},
    salesPerformance: {},
    forecastPerformance: {},
    honorList: [],
    reqrankingList: [],
    orderrankingList: [],
    salesFunnel: {},
    approvalCenterOrderList: [],
    callAnalysisNormal: {},
    callAnalysisDialout: {}
  },
  effects: {
    *init({ payload, dataAuthority }, { put }) {
      // yield put({ type: 'fetchUserCurrent' });
      // yield put({ type: 'fetchBossSeaList', payload: payload });
      // yield put({ type: 'fetchWorkPanelList', payload: payload });
      if (dataAuthority > 1) {  // 如果是专员以上的身份，就请求公司列表。否则只需要查看自己的数据。
        yield put({ type: 'fetchCompanyList', payload: payload });
      } else { // 专员就拉取自己的6项数据
        yield put({ type: 'fetchWorkbenchNums', payload: payload });
      }
      yield put({ type: 'fetchMyPerformance', payload: payload });
      yield put({ type: 'fetchSalesAssistant', payload: payload });
      yield put({ type: 'fetchSalesPerformance', payload: payload });
      yield put({ type: 'fetchForecastPerformance', payload: payload });
      yield put({ type: 'fetchHonorList', payload: payload });
      yield put({ type: 'fetchSalesFunnel', payload: payload });
      // yield put({ type: 'fetchApprovalCenter', payload: payload });
      yield put({ type: 'fetchCallAnalysis', payload: payload });
    },
    *fetchAll({ payload, dataAuthority }, { put }) {
      // yield put({ type: 'fetchUserCurrent' });
      // yield put({ type: 'fetchBossSeaList', payload: payload });
      // yield put({ type: 'fetchWorkPanelList', payload: payload });
      if (dataAuthority > 1) {  // 如果是专员以上的身份，就请求公司列表。否则只需要查看自己的数据。
        yield put({ type: 'fetchCompanyList', payload: payload });
      } else { // 专员就拉取自己的6项数据
        yield put({ type: 'fetchWorkbenchNums', payload: payload });
      }
      yield put({ type: 'fetchMyPerformance', payload: payload });
      yield put({ type: 'fetchSalesAssistant', payload: payload });
      yield put({ type: 'fetchSalesPerformance', payload: payload });
      yield put({ type: 'fetchForecastPerformance', payload: payload });
      yield put({ type: 'fetchHonorList', payload: payload });
      yield put({ type: 'fetchSalesFunnel', payload: payload });
      // yield put({ type: 'fetchApprovalCenter', payload: payload });
      yield put({ type: 'fetchCallAnalysis', payload: payload });
    },
    *fetchBossSeaList({ payload, callback }, { call, put }) {
      const response = yield call(getBossSea, payload);
      // console.log(JSON.stringify(response.data.result));
      yield put({
        type: 'save',
        payload: {
          bossSeaList: response.data.result,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *setBossSeaList({ payload, callback }, { call, put }) {
      const response = yield call(setBossSea, payload);
      console.log(JSON.stringify(response.data.result));
      yield put({
        type: 'save',
        payload: {
          setResult: response.data.result,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *fetchWorkPanelList({ payload, callback }, { call, put }) {
      const response = yield call(getWorkList, payload);
      // console.log(JSON.stringify(response.data.result));
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
      // yield put({
      //   type: 'save',
      //   payload: {
      //     workPaneList: response.data.result
      //   },
      // });
    },
    *setWorkPanelList({ payload, callback }, { call, put }) {
      const response = yield call(setWorkList, payload);
      console.log(JSON.stringify(response.data.result));
      // yield put({
      //   type: 'save',
      //   payload: {
      //     setResult: response.data.result,
      //   },
      // });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *fetchCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(queryCompanyList);
      // console.log(JSON.stringify(response.data.result));
      yield put({
        type: 'save',
        payload: {
          companyList: response.data.result.rows,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *fetchStructureList({ payload, callback }, { call, put }) {
      const response = yield call(queryStructureList, payload);
      // console.log(JSON.stringify(response.data.result.rows));
      yield put({
        type: 'save',
        payload: {
          structureList: response.data.result.rows[0].structureList,
        },
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *fetchUsersList({ payload, callback }, { call, put }) {
      const response = yield call(queryUsersList, payload);
      console.log(JSON.stringify(response.data.result.rows));
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
      yield put({
        type: 'save',
        payload: {
          userList: response.data.result.rows,
        },
      });
    },
    *fetchMyPerformance({ payload }, { call, put }) {
      const response = yield call(queryMyPerformance, payload);
      // console.log(JSON.stringify(response.data.result));
      yield put({
        type: 'save',
        payload: {
          myPerformance: response.data.result,
        },
      });
    },
    *fetchWorkbenchNums({ payload, callback }, { call, put }) {
      const response = yield call(workbenchNums);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
      yield put({
        type: 'save',
        payload: {
          workBenchNums: response.data.result,
        },
      });
    },
    *fetchSalesAssistant({ payload }, { call, put }) {
      const response = yield call(querySalesAssistant, payload);
      // console.log(JSON.stringify(response.data.result))
      yield put({
        type: 'save',
        payload: {
          salesAssistant: response.data.result,
        },
      });
    },
    *fetchSalesPerformance({ payload }, { call, put }) {
      const response = yield call(querySalesPerformance, payload);
      // console.log(JSON.stringify(response.data.result))
      yield put({
        type: 'save',
        payload: {
          salesPerformance: response.data.result,
        },
      });
    },
    *fetchForecastPerformance({ payload }, { call, put }) {
      const response = yield call(queryForecastPerformance, payload);
      // console.log(JSON.stringify(response.data.result))
      yield put({
        type: 'save',
        payload: {
          forecastPerformance: response.data.result,
        },
      });
    },
    *fetchHonorList({ payload }, { call, put }) {
      const response = yield call(queryHonorList, payload);
      // console.log(JSON.stringify(response.data.result))
      yield put({
        type: 'save',
        payload: {
          honorList: response.data.result,
        },
      });
    },
    *fetchReqrankingList({ payload }, { call, put }) {
      const response = yield call(queryReqrankingList, payload);
      // console.log(JSON.stringify(response.data.result))
      yield put({
        type: 'save',
        payload: {
          reqrankingList: response.data.result,
        },
      });
    },
    *fetchOrderrankingList({ payload }, { call, put }) {
      const response = yield call(queryOrderrankingList, payload);
      // console.log(JSON.stringify(response.data.result))
      yield put({
        type: 'save',
        payload: {
          orderrankingList: response.data.result,
        },
      });
    },
    *fetchSalesFunnel({ payload }, { call, put }) {
      const response = yield call(querySalesFunnel, payload);
      console.log(JSON.stringify(response.data.result))
      yield put({
        type: 'save',
        payload: {
          salesFunnel: response.data.result,
        },
      });
    },
    *fetchApprovalCenter({ payload }, { call, put }) {
      const response = yield call(queryApprovalCenter, payload);
      console.log(JSON.stringify(response.data.result))
      yield put({
        type: 'save',
        payload: {
          approvalCenter: response.data.result,
        },
      });
    },
    *fetchCallAnalysis({ payload }, { call, put }) {
      const response = yield call(queryCallAnalysis, payload);
      // console.log(JSON.stringify(response.data.result))
      if (payload.type === 'normal') {
        yield put({
          type: 'save',
          payload: {
            callAnalysisNormal: response.data.result,
          },
        });
      } else if (payload.type === 'dialout') {
        yield put({
          type: 'save',
          payload: {
            callAnalysisDialout: response.data.result,
          },
        });
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        currentUser: {},

        companyList: [],
        structureList: [],

        bossSeaList: [],
        workPaneList: [],
        workBenchNums: {},
        myPerformance: {},
        salesAssistant: {},
        salesPerformance: {},
        forecastPerformance: {},
        honorList: [],
        reqrankingList: [],
        orderrankingList: [],
        salesFunnel: {},
        approvalCenterOrderList: [],
        callAnalysis: {}
      };
    },
  },
};

export default Model;
