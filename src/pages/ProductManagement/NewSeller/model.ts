import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getCustomerConfig, getUserList, addSeller, storeDetail, editSeller } from './service';
import { ParamsAdd, ConfigList } from './data';




export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;


export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    configCtrl: Effect;
    userList: Effect;
    getAddSeller: Effect;
    getStoreDetail: Effect;
    editStoreInfo: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}
export interface StateType {
  config: ConfigList,
  userListArr: [],
}

const Model: ModelType = {
  namespace: 'newSeller',
  state: {
    config: {
      channel: [], //渠道
      customerLevel: [], //客户级别
      identity: [], //客户身份
      gender: [], //性别
      weddingStyle: [], //婚礼风格
      category: [], //业务品类
      contactTime: [], //方便联系时间
      contactWay: [], //跟进方式
      payType: [], //付款方式
      requirementStatus: [], //需求单状态
      followTag: [], //跟进标签
      leadsFollowStatus: [], //客资跟进状态
      customerFollowStatus: [], //客户跟进状态
      orderFollowStatus: [], //订单跟进状态
      leadsStatus: [], //客资状态
      banquetType: [], //婚宴类型
      carBrand: [], //车辆品牌
      photoStyle: [], //婚照风格
      hotelStar: [], //酒店星级
    },
  },

  effects: {
    *configCtrl({ payload }, { call, put }) {
      const response = yield call(getCustomerConfig, payload);
      let arr = response.data.result;
      yield put({
        type: 'save',
        payload: {
          config: arr
        },
      })
    },
    *userList({ payload, callback }, { call, put }) {
      const response = yield call(getUserList, payload);
      if (callback) {
        callback(response);
      } else {
        yield put({
          type: 'save',
          payload: {
            userList: response.data.result.rows
          },
        })
      }
    },
    *getAddSeller({ payload, callback }, { call, put }) {
      const response = yield call(addSeller, payload);
      // yield put({
      //   type: 'save',
      //   payload: {},
      // })
      if (callback) callback(response.code == 200, response.msg);
    },
    *getStoreDetail({ payload, callback }, { call, put }) {
      const response = yield call(storeDetail, payload);
      if (callback) {
        callback(response);
      } else {
        yield put({
          type: 'save',
          payload: {
            userList: response.data.result.rows
          },
        })
      }
    },
    *editStoreInfo({ payload, callback }, { call, put }) {
      const response = yield call(editSeller, payload);
      // yield put({
      //   type: 'save',
      //   payload: {},
      // })
      if (callback) callback(response.code == 200, response.msg);
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
