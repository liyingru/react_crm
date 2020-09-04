import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getCustomerConfig,editProduct,getStoreList,getProductDetail,delProductList} from './service';
import { ConfigList } from './commondata';
import { EditProductDataList,StoreDataList} from './data';




export type Effect = (
    action: AnyAction,
    effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;
  

export interface ModelType {
    namespace: string;
    state: StateType;
    effects: {
        configCtrl:Effect;
        getEditProduct:Effect;
        storeList:Effect;
        getDetails:Effect;
        delProduct:Effect;
    };
    reducers: {
        save: Reducer<StateType>;
    };
}
export interface StateType {
  config: ConfigList,
  getEditProduct:EditProductDataList,
  storeData:StoreDataList,
}


const Model: ModelType = {
    namespace: 'productDetail',
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
      *getEditProduct({ payload,callback }, { call, put }) {
        const response = yield call(editProduct, payload);
        if (callback) callback(response.code == 200,response.msg);
      },
      *getDetails({ payload,callback }, { call, put }) {
        const response = yield call(getProductDetail, payload);
        yield put({
          type: 'save',
          payload:response.data.result,
          callback
        });
        if(callback)callback(response)
      },
      // 删除产品
      *delProduct({ payload, callback }, { call, put }) {
        let response = yield call(delProductList, payload);
        if (callback) callback(response);
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
  