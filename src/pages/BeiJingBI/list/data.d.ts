import { ConfigItemCommon } from "@/commondata";

export interface TableListItem {
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  title: string;
  owner: string;
  desc: string;
  callNo: number;
  status: number;
  updatedAt: Date;
  createdAt: Date;
  progress: number;

  customer_id: number;
  customer_name: string;
  customer_level: string;
  company_name: string;
  channel: string;
  category: string;
  leads_owner_name: string;
  req_owner_name: string;
  record_user_name: string;
  order_banquet_owner_name: string;
  order_wedding_owner_name: string;
  customer_follow_time: string;
  customer_follow_content: string;
  leads_follow_time: string;
  leads_follow_content: string;
  req_follow_time: string;
  req_follow_content: string;
  allot_time: string;
  leads_allot_time: string;
  req_allot_time: string;
  customer_status: string;
  leads_status: string;
  req_status: string;
  banquet_status: string;
  leads_banquet_status: string;
  req_banquet_status: string;
  order_banquet_status: string;
  wedding_status: string;
  leads_wedding_status: string;
  req_wedding_status: string;
  order_wedding_status: string;
  photo_status: string;
  celebration_status: string;
  car_status: string;
  one_stop_status: string;
  dress_status: string;
  call_valid_status: string;
  call_valid_num: string;
  call_invalid_num: string;
  banquet_commission: string;
  wedding_commission: string;
  req_banquet_once_valid: string;
  req_wedding_once_valid: string;
  create_time: string;
}
export interface ConfigListItem {
  id: string;
  name: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}

export interface CustomListItem {
  name: string;
  id: string;
  disable: boolean;
}

export interface CompanyChannel {
  value: number,
  label: string,
}

export interface CompanyUser {
  id: number;
  job_number: number;
  name: string;
  avatar: string;
  sex: number;
  account: string;
  company_id: string;
  company_name: string;
  structure_id: string;
  structure_name: string;
  position_id: string;
  position_name: string;
  role_id: string;
  role_name: string;
  rank: number;
  correction_date: string;
  status: number;
  last_login_time: string;
  password: string;
  entry_date: string;
  city_code: string;
  moor_number: string;
  moor_type: string;
  ac_account: string;

  is_liheuser: 0 | 1;
  birthday: string;
  address: string;
  check_in_or_out: 1 | 2;  // 用户的上线离线状态  1上线  2离线
}

export interface User {
  id: number;
  name: string;
}

export interface RulesUsers {
  into_user_list: User[],
  receive_user_list: User[],
}

export interface ConfigData {
  requirementPhase: ConfigItem[];
  channel: CategoryConfigItem[]
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
  /** 主营品类 */
  mainCategory: ConfigItemCommon[]
  /** 其他品类（除主营品类外， 且有多级品类） */
  otherCategory: CategoryConfigItem[]
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



