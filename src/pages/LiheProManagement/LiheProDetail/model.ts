import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  commonConfigReq
} from '../LiheProHome/service';

export interface TableListParams {

}
export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    commonConfigCtrl: Effect;
  
    fetchCustomerStatusConfig: Effect;
    taskConfigCtrl: Effect;
    
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

export interface StateType {
  customerStatusMap: {id:number, name: string}[] | undefined,
  configData: {},
}

const Model: ModelType = {
  namespace: 'LiheProDetail',
  state: {
    customerStatusMap: undefined,
    configData: {},
  },
  effects: {
    // 客户状态枚举项
    *fetchCustomerStatusConfig({ payload }, { call, put }) {
      // let response = yield call(taskConfigCtrl, payload);
      // test
      const customerStatusMap = [
        {id: 0, name: '已沟通'},
        {id: 1, name: '已进店'},
        {id: 2, name: '已签订单'},
        {id: 3, name: '已定人员'},
        {id: 4, name: '已交中期款'},
        {id: 5, name: '已交尾款'},
        {id: 6, name: '婚礼已完成'},
        {id: 7, name: '交付影像资料'},
      ]
      yield put({
        type: 'save',
        payload: { customerStatusMap: customerStatusMap },
      });
    },

    // 任务配置
    *commonConfigCtrl({ payload }, { call, put }) {
      let response = yield call(commonConfigReq, payload);
      yield put({
        type: 'save',
        payload: { configData: response.data.result },
      });
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

