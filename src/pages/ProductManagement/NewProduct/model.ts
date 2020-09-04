import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getCustomerConfig,addProduct,getStoreList} from './service';
import { ConfigList } from './commondata';
import { AddProductDataList,StoreDataList} from './data';




export type Effect = (
    action: AnyAction,
    effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;
  

export interface ModelType {
    namespace: string;
    state: StateType;
    effects: {
        configCtrl:Effect;
        getAddProduct:Effect;
        storeList:Effect;
    };
    reducers: {
        save: Reducer<StateType>;
    };
}
export interface StateType {
  config: ConfigList,
  getAddProduct:AddProductDataList,
  storeData:StoreDataList,
}


const Model: ModelType = {
    namespace: 'newProduct',
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
        requirementStatus: [], //有效单状态
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
      storeData:[],
    },
  
    effects: {
      *configCtrl({ payload }, { call, put }) {
        const response = yield call(getCustomerConfig, payload);
        let arr = response.data.result;
        yield put({
          type: 'save',
          payload: {
            config:arr
          },
        })
      },
      *storeList({ payload }, { call, put }) {
        const response = yield call(getStoreList, payload);
        yield put({
          type: 'save',
          payload: {
            storeData:response.data.result.rows
          },
        })
      },
      *getAddProduct({ payload,callback }, { call, put }) {
        const response = yield call(addProduct, payload);
        if (callback) callback(response.code == 200,response.msg);
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
  