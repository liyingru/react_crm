import { StringNullableChain } from "lodash";

/**
 * 配置
 */
export interface ConfigItem {
  id: string | number;
  name: string;
}
export interface CategoryConfigItem {
  value: string;
  label: string;
  pid: number;
  children: CategoryConfigItem[];
}

/**
 * 城市地址信息
 */
export interface CityInfo {
  province: string,
  city: string,
  district: string,
  full: string,
  city_code: string
}

export interface bookTagParams {
  brand: string;
  price: string;
}

export interface bookTagContent {
  banquet: bookTagParams
  wedding: bookTagParams
  photography: bookTagParams
  car: bookTagParams
  celebration: bookTagParams
  oneStop: bookTagParams
}

export interface bookTagResult {
  category: string,
  bizContent: bookTagContent
}

/**
 * 客户信息
 */
export interface CustomerInfoData {
  customerId: string;
  customerLevel: string;
  customerLevelText: string;
  channel: string;
  customerName: string;
  gender: string;
  genderText: string;
  identity: string;
  identityText: string;
  weddingDate: string;
  wedding_date_from: string;
  wedding_date_end: string;
  phone: string;
  weChat: string;
  liveCityInfo: CityInfo;
  liveAddress: string;
  workCityInfo: CityInfo;
  workAddress: string;
  contactTime: string;
  referrerName: string;
  budget: string;
  likeCityInfo: CityInfo;
  category: string;
  weddingStyle: string;
  weddingStyleText: string;
  deskNum: string;
  hotel: string;
  encryptPhone: string;
  bookTag: bookTagResult;
  requirement: ReqData[];
  contact_time: string;
  create_time: string;
  create_user: string;
  referrer_name: string;
  referrer_phone: string;
  edit_status: string;
  company_tag: string;
  status_text: string;
  level_text: string;
  channel_text: string;
  remark: string;
  owner_name: string;
  complaint_status: 0 | 1 | 2 | 3 | 4;  // 客诉审核状态  0表示正常无客诉单，1表示已有客诉单待审核处理，2表示跟进中，3表示投诉升级，4表示客诉单已处理完结可再次发起新的客诉
  complaint_id: string;  // 客诉单的id
  // 跟进配置
  followData: FollowDataModel;
  //提供人除到喜啦外用这个字段
  record_user_name: string;
}

export interface ReqData {
  reqId: string;
  category: string;
  requirement_id: string;
  requirement_status: int;
  req_num: string;
  phase: number;
}


/**
 * 跟进配置项
 */
export interface ConfigData {
  requirementPhase: ConfigItem[];
  channel: ConfigItem[]
  customerLevel: ConfigItem[]
  leadsFollowStatus: ConfigItem[]
  customerFollowStatus: ConfigItem[]
  orderFollowStatus: ConfigItem[]
  leadsStatus: ConfigItem[]
  flowStatus: ConfigItem[]
  identity: ConfigItem[]
  gender: ConfigItem[]
  weddingStyle: ConfigItem[]
  photoStyle: ConfigItem[]
  category: ConfigItem[]
  banquetType: ConfigItem[]
  siteType: ConfigItem[]
  scheduleType: ConfigItem[]
  dressUseWay: ConfigItem[]
  dressModel: ConfigItem[]
  dressType: ConfigItem[]
  contactTime: ConfigItem[]
  contactWay: ConfigItem[]
  followTag: ConfigItem[]
  requirementFollowTag: ConfigItem[]
  requirementReturnReason: ConfigItem[]
  requirementCloseReason: ConfigItem[]
  leadsFollowTag: ConfigItem[]
  payType: ConfigItem[]
  requirementStatus: ConfigItem[]
  carBrand: ConfigItem[]
  hotelStar: ConfigItem[]
  task: ConfigItem[]
  activity: ConfigItem[]
  source: []
  requirementFollowStatus: ConfigItem[]
  category2: CategoryConfigItem[]
  complaintType: ConfigItem[]
  weddingDateTag: ConfigItem[]
  isArrival: ConfigItem[]
  weddingDateTag: ConfigItem[]
  requirementLevel: ConfigItem[]
  validStatus: ConfigItem[]
  timeoutStatus: ConfigItem[]
  nbCompany: ConfigItem[]
  customerStatus: ConfigItem[]
  orderPhase: ConfigItem[]
  orderArrivalStatus: ConfigItem[]
}

// 跟进配置信息
export interface FollowDataModel {
  showFollowButton: string;
  followTab: FollowTab[];
}
// 跟进配置信息
export interface FollowTab {
  key: number
  val: string
}


/**
 * 订单信息
 */
export interface OrderData {
  id: number;
  order_num: string;
  category: number;
  category_txt: string;
  city: string;
  district: string;
  channel: string;
  merchant: string;
  status: number;
  status_txt: string;
  follow_status: number;
  follow_status_txt: string;
  create_time: string;
  update_time: string;
  req_id: number;
  customer_id: number;
  customer_name: string;
  contacts: string;
  gender: number;
  mobile: string;
  wechat: string;
  wedding_day: string;
  service_time: string;
  sign_time: string;
  budget: string;
  kefu: string;
  sale: string;
  user_id: number;
}

/**
 * 推荐商家信息
 */
export interface RecommendMerchantData {
  category_id: number;
  category_name: string;
  data: MerchantData[];
}

/**
 * 商家信息
 */
export interface MerchantData {
  city: string;
  district: string;
  merchant: string;
  recommend_level: string;
  features: string;
  price_range: string;
  recommend_time: string;
  recommend_name: string;
}

/**
 * 跟进列表
 */
export interface FollowData {
  total: number;
  rows: FollowTime[];
}
/**
 * 跟进列表item
 */
export interface FollowTime {
  followTime: string;
  callDuration: string;
  followType: string;
  results: string;
  comment: string;
  nextContactTime: string;
  contactWay: string;
  followUser: string;
  attachment: string;
  followTag: string;
  arrivalTime: string;
  productName: string;
  state: string;
  couponName: string;
}

/**
 * 联系人信息
 */
export interface ContactInfoData {
  contactId: number;
  userName: string;
  phone: string;
  identity: number;
  identityText: string;
  occupation: string;
  contactTime: number;
  contactTimeText: string;
  comment: string;
  weChat: string;
}

/**
 * 质检核查
 */
export interface CustomerQualityInspection {
  id: string;
  data_id: string;
  data_type: string;
  user_id: string;
  user_name: string;
  caller: string;
  phone: string;
  record_file: string;
  is_connect: string;
  duration: string;
  contact_time: string;
  create_time: string;
  call_type: string;
  telephone_company: string;
  duration: string;
}

/**
 * 需求信息
 */
export interface RequirementData {
  id: number;
  channel: string;
  level: string;
  level_txt: string;
  req_num: string;
  category: string;
  category_txt: string;
  top_category: number;
  city_info: CityInfo;
  city_code: string;
  budget: string;
  budget_from: string;
  budget_end: string;
  merchant: string;
  photo_style: string;
  photo_time: string;
  wedding_style: string;
  banquet_type: string;
  final_category: string;
  site_type: string;
  schedule_type: string;
  per_budget: string;
  per_budget_from: string;
  per_budget_end: string;
  hotel: string;
  hotel_star: string;
  hotel_tables: string;
  hotel_tables_from: string;
  hotel_tables_end: string;
  hotel_hall: string;
  car_brand: string;
  car_series: string;
  car_num: string;
  car_time: string;
  dress_use_way: string;
  dress_model: string;
  dress_type: string;
  dress_num: string;
  car_info: CardBrand[];
  est_arrival_time: string;
  status: string;
  phase: string;
  status_txt: string;
  create_time: string;
  update_time: string;
  user_id: string;
  customer_id: string;
  user_name: string;
  remark: string;
  close_reason: string;
  return_reason: string;
  need_auto_distribute: 0 | 1; // 是否自由分配
  buttons: ReqButton[];
  show_array:string[];
}

export interface ReqButton {
  type: number;
  name: string;
  assign_merchant_ids: string[];
  echo: boolean;
  aid: string;
}

export interface CardBrand {
  car_brand: string;
  car_num: string;
  carBrand: string;
  carNum: string;
}


/**
 * 需求信息详情
 */
export interface RequirementDataDetails {
  category_id: number;
  category_name: string;
  data: RequirementData[];
}

/**
 * 客户线索
 */
export interface CustomerLeadsListData {
  category_id: number;
  category_name: string;
  data: CustomerLeadsData[];
}

/**
 * 客户线索
 */
export interface CustomerLeadsData {
  id: number;
  channel: string;
  level: string;
  level_txt: string;
  category: string;
  category_txt: string;
  top_category: number;
  city_info: CityInfo;
  city_code: string;
  budget: string;
  budget_from: string;
  budget_end: string;
  merchant: string;
  photo_style: string;
  photo_time: string;
  wedding_style: string;
  banquet_type: string;
  final_category: string;
  site_type: string;
  schedule_type: string;
  per_budget: string;
  per_budget_from: string;
  per_budget_end: string;
  hotel: string;
  hotel_star: string;
  hotel_tables: string;
  hotel_tables_from: string;
  hotel_tables_end: string;
  hotel_hall: string;
  car_brand: string;
  car_series: string;
  car_num: string;
  car_time: string;
  dress_use_way: string;
  dress_model: string;
  dress_type: string;
  dress_num: string;
  car_info: CardBrand[];
  est_arrival_time: string;
  status: string;
  phase: string;
  status_txt: string;
  create_time: string;
  update_time: string;
  user_id: string;
  customer_id: string;
  user_name: string;
  remark: string;
  close_reason: string;
  return_reason: string;
  need_auto_distribute: 0 | 1; // 是否自由分配
  buttons: ReqButton[];
  show_array:string[];
}



/**
 * 需求信息分组详情
 */
export interface RequirementDataGroupDetails {
  my: RequirementDataDetails[];
  other: RequirementDataDetails[];
}

/**
 * 下一个线索的信息
 */
export interface nextLeadsIds {
  customer_id: string;
  leads_id: string;
}

