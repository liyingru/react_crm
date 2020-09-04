import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  ListPagination,
  dressAndJourneyPhotoListModel,
  weddingServiceListModel,
  clothingListModel,
  honeymoonListModel,
  newCategoryListModel,
  ConfigList,
  storeDetailSeriesModel
} from "./data";
import { message } from 'antd';
import {
  initData,
  storeHotelConfig,
  storeHotelList,
  storeHotelDetail,
  storeWeddingConfig,
  storeWeddingList,
  storeWeddingDetail,
  storeHunqingList,
  storeHunqingDetail,
  storeClothingList,
  storeClothingDetail,
  storeHoneymoonList,
  storeHoneymoonDetail,
  storeCustomerDetail,
  saveRecommendCtrlReq,
  getCustomerConfig,
  getNewCategory,
  getNewCategoryDetail,
  recommendCsDetail,//有效单详情 推荐商家要用
  getStoreContact,
  getStoreCoupon,
  getStoreGoods,
  getMoorPhoneDialout,
} from './service';


import {
  // 详情
  storeHotelDetailModel,
  storePhotoAndJourneySellerDetailModel,
  storeServiceDetailModel,
  storeDressesSellerDetailModel,
  storeHoneymoonSellerDetailModel,
  storeNewCategoryDetailDataModel,
  storeHotelListModel,
} from './data';
import { deflate } from 'zlib';
import { query } from '@/services/user';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    initDataCtrl: Effect;
    hotelConfig: Effect;
    hotelList: Effect;
    hotelDetail: Effect;
    weddingConfig: Effect;
    dressPhotoList: Effect;
    weddingList: Effect;
    weddingPhotoDetail: Effect;
    journeyPhotoDetail: Effect;
    hunqingList: Effect;
    hunqingDetail: Effect;
    clothingList: Effect;
    clothingDetail: Effect;
    honeymoonList: Effect;
    honeymoonDetail: Effect;
    customerDetail: Effect;
    saveRecommendCtrl: Effect;
    configCtrl: Effect;
    newCategory: Effect;
    newCategoryDetail: Effect;
    recommendCsDetailCtrl: Effect;
    getStoreContact: Effect;
    getStoreCoupon: Effect;
    getStoreGoods: Effect;
    storeGoodCtrl: Effect;
    storeContact:Effect;
    moorPhoneDialoutCtrl:Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

export interface StateType {
  config: ConfigList;
  recommendDetail: {};
  detailLoading: boolean;
  hotelListData: {
    rows: storeHotelListModel[],
    pagination: Partial<ListPagination>,
  };
  dressPhotoListData: {
    rows: dressAndJourneyPhotoListModel[],
    pagination: Partial<ListPagination>,
  };
  journeyPhtoListData: {
    rows: dressAndJourneyPhotoListModel[],
    pagination: Partial<ListPagination>,
  };
  weddingServiceListData: {
    rows: weddingServiceListModel[],
    pagination: Partial<ListPagination>,
  };
  clothingListData: {
    rows: clothingListModel[],
    pagination: Partial<ListPagination>,
  }
  honeymoonListData: {
    rows: honeymoonListModel[],
    pagination: Partial<ListPagination>,
  };
  newCategoryListData: {
    rows: newCategoryListModel[],
    pagination: Partial<ListPagination>,
  };



  // 详情用
  hotelDetail: storeHotelDetailModel;
  photoSellerDetail: storePhotoAndJourneySellerDetailModel;
  journeyPhotoSellerDetail: storePhotoAndJourneySellerDetailModel;
  serviceDetail: storeServiceDetailModel;
  dressesSellerDetail: storeDressesSellerDetailModel;
  honeymoonSellerDetail: storeHoneymoonSellerDetailModel;
  newCategoryDetailData: storeNewCategoryDetailDataModel;
  // 推荐数组
  recommendes: [];
  recommendBanquet: [],
  recommendWedding: [],
  recommendPhotography: [],
  recommendCelebration: [],
  recommendCar: [],
  recommendOneStop: [],
  recommendDress: [],
  detailObj: {},
  queryObj: {}
  // 联系人
  newCategoryDetailContactListData: [],
  // 商家活动
  storeCouponData: {},
  storeGoodsData: storeDetailSeriesModel,
  // 宴会厅
  storeGoodArr: {},
  storeMenu: {},
  // 套系
  storePlan: {}

}

const Model: ModelType = {
  namespace: 'storeDetailList',

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
    detailLoading: true,
    recommendDetail: {},
    hotelListData: {
      rows: [],
      pagination: {},
    },
    dressPhotoListData: {
      rows: [],
      pagination: {},
    },
    journeyPhtoListData: {
      rows: [],
      pagination: {},
    },
    weddingServiceListData: {
      rows: [],
      pagination: {},
    },
    clothingListData: {
      rows: [],
      pagination: {},
    },
    honeymoonListData: {
      rows: [],
      pagination: {},
    },
    newCategoryListData: {
      rows: [],
      pagination: {},
    },
    hotelDetail: {
      pice: '',
      feature: '',
      desk: '',
      desc: {},
      service: {},
      tab: '',
      city_name: '',
      region_name: '',
      name: '',
      biz_name: '',
      level: '',
      address: '',
      type: '',
      star: '',
      other: '',
      kefu_remark: '',
    },
    photoSellerDetail: {
      base: {},
      tab: '',
    },
    journeyPhotoSellerDetail: {
      base: {},
      tab: '',
    },
    serviceDetail: {
      base: {},
      tab: '',
    },
    dressesSellerDetail: {
      base: {},
      tab: '',
    },
    honeymoonSellerDetail: {
      base: {},
      tab: '',
    },
    newCategoryDetailData: {
      base: {},
      tab: '',
    },
    // 推荐数组
    recommendes: [],

    recommendBanquet: [],
    recommendWedding: [],
    recommendPhotography: [],
    recommendCelebration: [],
    recommendCar: [],
    recommendOneStop: [],
    recommendDress: [],
    detailObj: {},
    queryObj: {},
    // 联系人
    newCategoryDetailContactListData: [],
    // 商家的活动
    storeCouponData: {},
    // 商家套系
    storeGoodsData: {
      goods: [],
      goods_info: {},
    },
    // 宴会厅 菜单 套系
    storeGoodArr: {},
    // 菜单
    storeMenu: {},
    // 套系
    storePlan: {}


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
    *initDataCtrl({ payload, callback }, { call }) {
      let response = yield call(initData, payload);
      if (callback) callback(response);
    },
    *hotelConfig({ payload, callback }, { call, put }) {
      const response = yield call(storeHotelConfig, payload);
      if (callback) callback(response);
    },
    *hotelList({ payload, callback }, { call, put }) {
      const response = yield call(storeHotelList, payload);
      let pagination = {
        total: response.data.result.total,
        pageSize: response.data.result.pageSize,
        current: response.data.result.page || 1,
      }
      let data = {
        'rows': response.data.result.rows,
        'pagination': pagination
      }
      yield put({
        type: 'save',
        payload: {
          hotelListData: data,
        },
        callback
      });
      if (callback) callback(data);
    },
    *hotelDetail({ payload, callback }, { call, put }) {
      const response = yield call(storeHotelDetail, payload);
      yield put({
        type: 'save',
        payload: {
          hotelDetail: response.data.result,
        }
      });
      if (callback) callback();
    },
    *recommendCsDetailCtrl({ payload, callback }, { call, put }) {
      const response = yield call(recommendCsDetail, payload);
      // console.log('recommendDetail=========有效单详情',response)
      yield put({
        type: 'save',
        payload: {
          recommendDetail: response.data.result,
        }
      });
      if (callback) callback();
    },
    
   

    *weddingConfig({ payload, callback }, { call, put }) {
      const response = yield call(storeWeddingConfig, payload);
      if (callback) callback(response);
    },
    *customerDetail({ payload, callback }, { call, put }) {
      const response = yield call(storeCustomerDetail, payload);
      if (callback) callback(response);
    },

    *dressPhotoList({ payload, callback }, { call, put }) {
      const response = yield call(storeWeddingList, payload);
      let pagination = {
        total: response.data.result.total,
        pageSize: response.data.result.pageSize,
        current: response.data.result.page || 1,
      }
      let data = {
        'rows': response.data.result.rows,
        'pagination': pagination
      }
      yield put({
        type: 'save',
        payload: {
          dressPhotoListData: data,
        },
      });
      if (callback) callback();
    },
    *weddingList({ payload, callback }, { call, put }) {
      const response = yield call(storeWeddingList, payload);
      let pagination = {
        total: response.data.result.total,
        pageSize: response.data.result.pageSize,
        current: response.data.result.page || 1,
      }
      let data = {
        'rows': response.data.result.rows,
        'pagination': pagination
      }
      yield put({
        type: 'save',
        payload: {
          journeyPhtoListData: data,
        },
      });
      if (callback) callback();
    },
    *weddingPhotoDetail({ payload, callback }, { call, put }) {
      const response = yield call(storeWeddingDetail, payload);
      yield put({
        type: 'save',
        payload: {
          photoSellerDetail: response.data.result,
        }
      });
      if (callback) callback();
    },
    *journeyPhotoDetail({ payload, callback }, { call, put }) {
      const response = yield call(storeWeddingDetail, payload);
      yield put({
        type: 'save',
        payload: {
          journeyPhotoSellerDetail: response.data.result,
        }
      });
      if (callback) callback();
      // const response = yield call(storeWeddingDetail, payload);
      // let pagination = {
      //   total: response.data.result.count,
      //   pageSize: response.data.result.page_size,
      //   current: response.data.result.page || 1,
      // }
      // let data = {
      //   'rows': response.data.result.rows,
      //   'pagination': pagination
      // }
      // yield put({
      //   type: 'save',
      //   payload: {
      //     journeyPhtoListData: data,
      //   },
      // });
      // if (callback) callback();
    },
    *hunqingList({ payload, callback }, { call, put }) {
      const response = yield call(storeHunqingList, payload);
      let pagination = {
        total: response.data.result.total,
        pageSize: response.data.result.pageSize,
        current: response.data.result.page || 1,
      }
      let data = {
        'rows': response.data.result.rows,
        'pagination': pagination
      }
      yield put({
        type: 'save',
        payload: {
          weddingServiceListData: data,
        },
      });
      if (callback) callback();
    },
    *hunqingDetail({ payload, callback }, { call, put }) {
      const response = yield call(storeHunqingDetail, payload);
      yield put({
        type: 'save',
        payload: {
          serviceDetail: response.data.result,
        }
      });
      if (callback) callback();
    },
    *clothingList({ payload, callback }, { call, put }) {
      const response = yield call(storeClothingList, payload);
      let pagination = {
        total: response.data.result.total,
        pageSize: response.data.result.pageSize,
        current: response.data.result.page || 1,
      }
      let data = {
        'rows': response.data.result.rows,
        'pagination': pagination
      }
      yield put({
        type: 'save',
        payload: {
          clothingListData: data,
        },
      });
      if (callback) callback();
    },
    *clothingDetail({ payload, callback }, { call, put }) {
      const response = yield call(storeClothingDetail, payload);
      yield put({
        type: 'save',
        payload: {
          dressesSellerDetail: response.data.result,
        }
      });
      if (callback) callback();
    },
    *honeymoonList({ payload, callback }, { call, put }) {
      const response = yield call(storeHoneymoonList, payload);
      let pagination = {
        total: response.data.result.total,
        pageSize: response.data.result.pageSize,
        current: response.data.result.page || 1,
      }
      let data = {
        'rows': response.data.result.rows,
        'pagination': pagination
      }
      yield put({
        type: 'save',
        payload: {
          honeymoonListData: data,
        },
      });
      if (callback) callback();
    },
    *honeymoonDetail({ payload, callback }, { call, put }) {
      const response = yield call(storeHoneymoonDetail, payload);
      yield put({
        type: 'save',
        payload: {
          honeymoonSellerDetail: response.data.result,
        }
      });
      if (callback) callback();
    },
    *newCategory({ payload, callback }, { call, put }) {
      const response = yield call(getNewCategory, payload);
      let pagination = {
        total: response.data.result.total,
        pageSize: response.data.result.pageSize,
        current: response.data.result.page || 1,
      }
      let data = {
        'rows': response.data.result.rows,
        'pagination': pagination
      }
      yield put({
        type: 'save',
        payload: {
          newCategoryListData: data,
        },
      });
      if (callback) callback();
    },
    *newCategoryDetail({ payload, callback }, { call, put }) {
      yield put({ type: 'save', payload: { detailLoading: true } });
      const response = yield call(getNewCategoryDetail, payload);
      yield put({
        type: 'save',
        payload: {
          newCategoryDetailData: response.data.result,
          detailLoading: false
        }
      });
      if (callback) callback(response);
    },
    *saveRecommendCtrl({ payload, callback }, { call, put }) {
      payload.filter.map((item) => {
        item.category = item.tab;
        item.merchant = item.name;
      })
      const response = yield call(saveRecommendCtrlReq, payload);
      if (callback) callback(response);

      // if(response.code == 200){
      //   message.success('推荐成功');
      // }else{
      //   message.error(response.msg);
      // }
      //let tab = payload.filter[0].category;
      // if(tab == 1){
      //   yield put({
      //     type: 'save',
      //     state: {recommendBanquet:[]}
      //   });
      // }
      // if(tab == 2){
      //   yield put({
      //     type: 'save',
      //     state: {recommendWedding:[]}
      //   });
      // }
      // if(tab == 3){
      //   yield put({
      //     type: 'save',
      //     state: {recommendPhotography:[]}
      //   });
      // }
      // if(tab == 4){
      //   yield put({
      //     type: 'save',
      //     state: {recommendCelebration:[]}
      //   });
      // }
      // if(tab == 5){
      //   yield put({
      //     type: 'save',
      //     state: {recommendCar:[]}
      //   });
      // }
      // if(tab == 6){
      //   yield put({
      //     type: 'save',
      //     state: {recommendOneStop:[]}
      //   });
      // }
      // if(tab == 7){
      //   yield put({
      //     type: 'save',
      //     state: {recommendDress:[]}
      //   });
      // }
    },
    // 联系人
    *storeContact({ payload, callback }, { call, put }) {
      yield put({ type: 'save', payload: { detailLoading: true } });
      const response = yield call(getStoreContact, payload);
      yield put({
        type: 'save',
        payload: {
          newCategoryDetailContactListData: response.data.result.contact,
          detailLoading: false
        }
      });
      if (callback) callback(response);
    },
    *moorPhoneDialoutCtrl({ payload, callback }, { call, put }) {
      console.log(payload)
      const response = yield call(getMoorPhoneDialout, payload);
      if (callback) callback(response);
    },
    *storeGoodCtrl({ payload, callback }, { call, put }) {
      yield put({ type: 'save', payload: { detailLoading: true, storeGoodArr: [] } });
      const response = yield call(getStoreGoods, payload);
      yield put({
        type: 'save',
        payload: {
          storeGoodArr: response.data.result,
          detailLoading: false
        }
      });
      if (callback) callback(response);
    },
    *storeGoods({ payload, callback }, { call, put }) {
      yield put({ type: 'save', payload: { detailLoading: true } });
      const response = yield call(getStoreGoods, payload);
      yield put({
        type: 'save',
        payload: {
          storeGoodsData: response.data.result,
          detailLoading: false
        }
      });
      if (callback) callback(response);
    },
    *storeCoupon({ payload, callback }, { call, put }) {
      yield put({ type: 'save', payload: { detailLoading: true } });
      const response = yield call(getStoreCoupon, payload);
      yield put({
        type: 'save',
        payload: {
          storeCouponData: response.data.result.data,
          detailLoading: false
        }
      });
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
    goLinkDetail(state: any, { payload }) {
      const newState = Object.assign({}, state, {
        detailObj: payload.obj,
        // detailLoading:true
      });
      return newState
    },
    queryCtrl(state: any, { payload }) {
      const newState = Object.assign({}, state, {
        queryObj: payload.obj
      });
      return newState
    },
    // 推荐 // 2020-3-9 1: 婚宴 recommendBanquet/ 2:婚庆 recommendWedding/ 3:婚纱摄影 recommendPhotography / 4:庆典or喜宴 recommendCelebration / 5:婚车 recommendCar / 6:一站式 recommendOneStop / 7:婚纱礼服 recommendDress/
    recommend(state: any, { payload, callback }) {
      // 第一个 recommendBanquet
      //console.log(payload)
      if (payload.recommend.name == '') { return state }
      if (payload.recommend.tab == 1) {
        const newState = Object.assign({}, state, {
          recommendBanquet: [...state.recommendBanquet]
        });
        const filters = state.recommendBanquet.filter((item: { merchantId: any; }) => {
          return item.merchantId === payload.recommend.merchantId
        });
        // console.log(filters)
        if (filters.length === 0) {
          newState.recommendBanquet.push(payload.recommend)
        }
        return newState;
      }
      // 第二个 recommendWedding
      if (payload.recommend.tab == 2) {
        const newState = Object.assign({}, state, {
          recommendWedding: [...state.recommendWedding]
        });
        const filters = state.recommendWedding.filter((item: { merchantId: any; }) => {
          return item.merchantId === payload.recommend.merchantId
        })
        if (filters.length === 0) {
          newState.recommendWedding.push(payload.recommend)
        }
        return newState;
      }
      // 第三个 recommendPhotography
      if (payload.recommend.tab == 3) {
        const newState = Object.assign({}, state, {
          recommendPhotography: [...state.recommendPhotography]
        });
        const filters = state.recommendPhotography.filter((item: { merchantId: any; }) => {
          return item.merchantId === payload.recommend.merchantId
        })
        if (filters.length === 0) {
          newState.recommendPhotography.push(payload.recommend)
        }
        return newState;
      }
      // 第四 个 recommendCelebration:[],
      if (payload.recommend.tab == 4) {
        const newState = Object.assign({}, state, {
          recommendCelebration: [...state.recommendCelebration]
        });
        const filters = state.recommendCelebration.filter((item: { merchantId: any; }) => {
          return item.merchantId === payload.recommend.merchantId
        })
        if (filters.length === 0) {
          newState.recommendCelebration.push(payload.recommend)
        }
        return newState;
      }
      // 第五个 recommendCar:[],
      if (payload.recommend.tab == 5) {
        const newState = Object.assign({}, state, {
          recommendCar: [...state.recommendCar]
        });
        const filters = state.recommendCar.filter((item: { merchantId: any; }) => {
          return item.merchantId === payload.recommend.merchantId
        })
        if (filters.length === 0) {
          newState.recommendCar.push(payload.recommend)
        }
        return newState;
      }
      // 第六个 recommendOneStop,
      if (payload.recommend.tab == 6) {
        const newState = Object.assign({}, state, {
          recommendOneStop: [...state.recommendOneStop]
        });
        const filters = state.recommendOneStop.filter((item: { merchantId: any; }) => {
          return item.merchantId === payload.recommend.merchantId
        })
        if (filters.length === 0) {
          newState.recommendOneStop.push(payload.recommend)
          callback();
        }
        return newState;
      }
      // 第七个 recommendDress,
      if (payload.recommend.tab == 7) {
        const newState = Object.assign({}, state, {
          recommendDress: [...state.recommendDress]
        });
        const filters = state.recommendDress.filter((item: { merchantId: any; }) => {
          return item.merchantId === payload.recommend.merchantId
        })
        if (filters.length === 0) {
          newState.recommendDress.push(payload.recommend)
          callback();
        }
        return newState;
      }


    },
    itemDeleteCtrl(state: any, { payload }) {
      if (payload.type == 1) {
        const newState = Object.assign({}, state, {
          recommendBanquet: [...state.recommendBanquet]
        });
        const list = newState.recommendBanquet;
        list.splice(payload.index, 1);
        return newState
      }
      if (payload.type == 2) {
        const newState = Object.assign({}, state, {
          recommendWedding: [...state.recommendWedding]
        });
        const list = newState.recommendWedding;
        list.splice(payload.index, 1);
        return newState
      }
      if (payload.type == 3) {
        const newState = Object.assign({}, state, {
          recommendPhotography: [...state.recommendPhotography]
        });
        const list = newState.recommendPhotography;
        list.splice(payload.index, 1);
        return newState
      }
      if (payload.type == 4) {
        const newState = Object.assign({}, state, {
          recommendCelebration: [...state.recommendCelebration]
        });
        const list = newState.recommendCelebration;
        list.splice(payload.index, 1);
        return newState
      }
      if (payload.type == 5) {
        const newState = Object.assign({}, state, {
          recommendCar: [...state.recommendCar]
        });
        const list = newState.recommendCar;
        list.splice(payload.index, 1);
        return newState
      }
      if (payload.type == 6) {
        const newState = Object.assign({}, state, {
          recommendOneStop: [...state.recommendOneStop]
        });
        const list = newState.recommendOneStop;
        list.splice(payload.index, 1);
        return newState
      }
      if (payload.type == 7) {
        const newState = Object.assign({}, state, {
          recommendDress: [...state.recommendDress]
        });
        const list = newState.recommendDress;
        list.splice(payload.index, 1);
        return newState
      }


    },
    recommendResetCtrl(state: any, { payload }) {
      if (payload.type == 1) {
        const newState = Object.assign({}, state, {
          recommendBanquet: []
        });
        return newState
      }
      if (payload.type == 2) {
        const newState = Object.assign({}, state, {
          recommendWedding: []
        });
        return newState
      }
      if (payload.type == 3) {
        const newState = Object.assign({}, state, {
          recommendPhotography: []
        });
        return newState
      }
      if (payload.type == 4) {
        const newState = Object.assign({}, state, {
          recommendCelebration: []
        });
        return newState
      }
      if (payload.type == 5) {
        const newState = Object.assign({}, state, {
          recommendCar: []
        });
        return newState
      }
      if (payload.type == 6) {
        const newState = Object.assign({}, state, {
          recommendOneStop: []
        });
        return newState
      }
      if (payload.type == 7) {
        const newState = Object.assign({}, state, {
          recommendDress: []
        });
        return newState
      }

    },
    resetDetailEmpty(state: any, { payload }) {
      const newState = Object.assign({}, state, {
        // hotelDetail: {},
        // photoSellerDetail:{},
        // serviceDetail:{},
        // journeyPhotoSellerDetail:{},
        // dressesSellerDetail:{},
        // honeymoonSellerDetail:{},
        newCategoryDetailData: {},
      });
      return newState
    }

  },

};

export default Model;

