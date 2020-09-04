import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {getMoneyDetail,getCommonConfig } from './service';

import { TableListData,ConfigList,CustomerDetail} from './data';

export interface StateType {
  data: CustomerDetail;
  moneyDetail: TableListData;
  configData: ConfigList;
}

export type Effect = (
    action: AnyAction,
    effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
    namespace: string;
    state: StateType;
    effects: {
      getMoneyDetail: Effect;
      config: Effect;
    };
    reducers: {
      save: Reducer<StateType>;
    };
}


const Model : ModelType = {
    namespace: 'moneydetailMangement',
    state: {
        moneyDetail:{
          receivablesInfo:[],
          orderInfo:[],
          customerInfo:[],
          contractInfo:[],
          summaryInfo:[]
        },
        configData: {
          channel: [], // 渠道
          customerLevel: [], // 客户级别
          identity: [], // 客户身份
          gender: [], // 性别
          weddingStyle: [], // 婚礼风格
          category: [], // 业务品类
          contactTime: [], // 方便联系时间
          contactWay: [], // 跟进方式
          payType: [], // 付款方式
          requirementStatus: [], // 有效单状态
          followTag: [], // 跟进标签
          leadsFollowStatus: [], // 客资跟进状态
          customerFollowStatus: [], // 客户跟进状态
          orderFollowStatus: [], // 订单跟进状态
          leadsStatus: [], // 客资状态
          banquetType: [], // 婚宴类型
          carBrand: [], // 车辆品牌
          photoStyle: [], // 婚照风格
          hotelStar: [], // 酒店星级
          source: [], // 活动来源
          category2: [],
          customerStatus:[],
          coupon:[],
        },
    },
    
    effects: {
      *getMoneyDetail({ payload,callback }, { call, put }) {
        const response = yield call(getMoneyDetail, payload);
        console.log(typeof(response.data.result.receivablesInfo),'------000000000')
        yield put({
          type: 'save',
          payload: {
            moneyDetail: response.data.result
          },
        });
        if (callback) callback(response);
      },
      *config({ payload,callback }, { call, put }) {
        const response = yield call(getCommonConfig, payload);
        yield put({
          type: 'save',
          payload: {
            configData: response.data.result
          },
        })
        // if (callback) callback(response);
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
}


export default Model;