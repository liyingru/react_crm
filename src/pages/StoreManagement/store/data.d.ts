


export interface TableListData {
  list: TableListItem[];
}
export interface storeParams {
  id: string;
  name: string;
}
interface ConfigListItem {
  id: string;
  name: string;
}
export interface ConfigState {
  channel: ConfigListItem[];
  business: ConfigListItem[];
  followRes: ConfigListItem[];
  weddingStyle: ConfigListItem[];
}

export interface ListPagination {
  total: number;
  pageSize: number;
  current: number;
}

//酒店列表
export interface storeHotelListModel {
  id: string;
  city_name: string;
  region_name: string;
  name: string;
  menu_price: string;
  desk_max_byhall: string;
  feature: string;
  biz_name: string;
  level: string;
  arrival_coupon: string;
  other: string;
  created: string;
  contract_start: string;
  contract_end: string;
  contract_end_time: string;
  confirm_rate: string;
  order: string;
}

//婚纱摄影、旅拍列表
export interface dressAndJourneyPhotoListModel {
  id: string;
  city_name: string;
  region_name: string;
  name: string;
  show_price: string;
  arrival_coupon: string;
  other: string;
  feature: string;
  created: string;
}

//婚庆服务列表
export interface weddingServiceListModel {
  id: string;
  city_name: string;
  region_name: string;
  name: string;
  show_price: string;
  style_tag: string;
  is_recommend: string;
  created: string;
}

//礼服列表 / 婚车
export interface clothingListModel {
  id: string;
  city_name: string;
  region_name: string;
  name: string;
  show_price: string;
  feature: string;
  created_at: string;
}

//蜜月列表
export interface honeymoonListModel {
  id: string;
  city_name: string;
  region_name: string;
  name: string;
  show_price: string;
  created_at: string;
}

//婚车列表
export interface weddingCarModel {
  id: string;
  city_name: string;
  region_name: string;
  name: string;
  show_price: string;
  created_at: string;
  recommend_status: string;
}

// 庆典or喜宴  一站式
export interface newCategoryListModel {
  category: int;
  city: string;
  region: string;
  created: int;
  name: string;
  payStart: int;
  payEnd: int;
}

// 酒店详情
export interface storeHotelDetailModel {
  pice: string,
  feature: string,
  desk: string,
  desc: Partial<hotelSellerDescDetail>,
  service: Partial<hotelSellerServiceDetail>,
  tab: string,
  city_name: string,
  region_name: string,
  name: string,
  biz_name: string,
  level: string,
  address: string,
  type: string,
  star: string,
  other: string,
  kefu_remark: string,
}

export interface storeHotelDescDetail {
  desc: string,
  comment: string,
  remark: string,
  feature: string,
}

export interface storeHotelServiceDetail {
  subway: string,
  bus: string,
  parking_flag: string,
  parking_desc: string,
  turf_flag: string,
  turf_desc: string,
  dressing_room_flag: string,
  dressing_room_desc: string,
  marriage_room_flag: string,
  marriage_room_desc: string,
  entry_fee_flag: string,
  entry_fee_desc: string,
  open_fee_flag: string,
  open_fee_desc: string,
  church_flag: string,
  church_desc: string,
  service_fee_flag: string,
  service_fee_desc: string,
}

// 婚纱摄影 || 旅拍
export interface storePhotoAndJourneySellerDetailModel {
  base: Partial<weddingPhotoBaseSellerDetail>,
  tab: string,
}

export interface storePhotoBaseSellerDetail {
  name: string,
  address: string,
  geohash: string,
  comment: string,
  time_open: string,
  time_end: string,
  toll_mode: string,
  pos_flag: string,
  travel_flag: string,
  features: string,
  promise: string,
  city_name: string,
  city_name: string,
  region_name: string,
  other: string,
}

// 婚庆服务
export interface storeServiceDetailModel {
  base: Partial<weddingServiceBaseSellerDetail>,
  tab: string,
}

export interface storeServiceBaseSellerDetail {
  name: string,
  url: string,
  recommend_fee: string,
  kefu_remark: string,
  city_name: string,
  cooperation_flag: string,
  recommend_flag: string,
  region_name: string,
  toll_mode: string,
  address: string,
  hotel: weddingServiceBaseHotelSellerDetail[],
  biz_selling_point: string,
  branches: weddingServiceBaseBranchesSellerDetail[],
  feature: string,
  style_tag: string,
  show_price: string,
  description: string,
  other: string,
}

export interface storeServiceBaseHotelSellerDetail {
  name: string,
  id: string,
}

export interface storeServiceBaseBranchesSellerDetail {
  address: string,
  latitude: string,
  longitude: string,
}

// 婚纱礼服
export interface storeDressesSellerDetailModel {
  base: Partial<weddingDressesBaseSellerDetail>,
  tab: string,
}

export interface storeDressesBaseSellerDetail {
  name: string,
  url: string,
  toll_mode: string,
  address: string,
  opening: string,
  content: string,
  cooperation: string,
  city_name: string,
  region_name: string,
  show_price: string,
  styles: string,
  description: string,
}

// 蜜月
export interface storeHoneymoonSellerDetailModel {
  base: Partial<honeymoonBaseSellerDetail>,
  tab: string,
}

// 其他类别
export interface storeNewCategoryDetailDataModel {
  base: Partial<newCategoryDetailData>,
  tab: string,
}

export interface storeHoneymoonBaseSellerDetail {
  name: string,
  address: string,
  full_name: string,
  phone: string,
  cooperation: string,
  city_name: string,
  region_name: string,
  show_price: string,
}

export interface storeRecommend {
  id: number,
  tab: number,
  name: string
}

export interface storeDetailSeriesModel {
  goods: [],
  goods_info: {}
}


/**
 * 通用配置项
 */
export interface ConfigList {
  channel: ConfigListItem[]; //渠道
  customerLevel: ConfigListItem[]; //客户级别
  identity: ConfigListItem[]; //客户身份
  gender: ConfigListItem[]; //性别
  weddingStyle: ConfigListItem[]; //婚礼风格
  category: ConfigListItem[]; //业务品类
  contactTime: ConfigListItem[]; //方便联系时间
  contactWay: ConfigListItem[]; //跟进方式
  payType: ConfigListItem[]; //付款方式
  requirementStatus: ConfigListItem[]; //有效单状态
  followTag: ConfigListItem[]; //跟进标签
  leadsFollowStatus: ConfigListItem[]; //客资跟进状态
  customerFollowStatus: ConfigListItem[]; //客户跟进状态
  orderFollowStatus: ConfigListItem[]; //订单跟进状态
  leadsStatus: ConfigListItem[]; //客资状态
  banquetType: ConfigListItem[]; //婚宴类型
  carBrand: ConfigListItem[]; //车辆品牌
  photoStyle: ConfigListItem[]; //婚照风格
  hotelStar: ConfigListItem[]; //酒店星级
}
