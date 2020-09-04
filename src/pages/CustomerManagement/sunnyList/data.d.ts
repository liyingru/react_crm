
import { Pagination } from "@/commondata";

// customerLevel	否	int	客户评级
export interface CustomerListParams {
  pageSize: number;
  page: number;
  city: string;
  channel: number;
  createStartTime: string;
  createEndTime: string;
  flowStatus: number;
  customerName: string;
  customerLevel: number;
}
export interface ConfigListItem {
  id: string;
  name: string;
}

export interface CustomerListData {
  list: CustomerListItem[];
  pagination: Partial<Pagination>;
}

export interface CustomerListItem {
  allot_time: string;
  banquet_commission: string;
  banquet_status: string;
  banquet_team_user: string;
  call_invalid_num: number;
  call_valid_num: number;
  call_valid_status: string;
  car_status: string;
  category: string;
  celebration_status: string;
  channel: string;
  create_time: string;
  customer_follow_content: string;
  customer_follow_time: string;
  customer_id: number;
  customer_level: string;
  customer_name: string;
  customer_status: string;
  customer_status_id: number;
  dress_commission: string;
  dress_status: string;
  dress_team_user: string;
  group_customer_id: number;
  leads_allot_time: string;
  leads_banquet_status: string;
  leads_banquet_team_ids: string;
  leads_dress_status: string;
  leads_dress_team_ids: string;
  leads_follow_content: string;
  leads_follow_status: string;
  leads_follow_tag: string;
  leads_follow_time: string;
  leads_owner_name: string;
  leads_photo_status: string;
  leads_photo_team_ids: string;
  leads_status: string;
  leads_wedding_status: string;
  leads_wedding_team_ids: string;
  one_stop_status: string;
  order_banquet_arrive_status: string;
  order_banquet_status: string;
  order_wedding_arrive_status: string;
  order_wedding_status: string;
  phone: string;
  photo_commission: string;
  photo_status: string;
  photo_team_user: string;
  record_user_name: string;
  req_allot_time: string;
  req_banquet_once_valid: string;
  req_banquet_status: string;
  req_banquet_team_ids: string;
  req_dress_once_valid: string;
  req_dress_status: string;
  req_dress_team_ids: string;
  req_first_valid_banquet_time: string;
  req_first_valid_dress_time: string;
  req_first_valid_photo_time: string;
  req_first_valid_wedding_time: string;
  req_follow_content: string;
  req_follow_status: string;
  req_follow_tag: string;
  req_follow_time: string;
  req_owner_name: string;
  req_photo_once_valid: string;
  req_photo_status: string;
  req_photo_team_ids: string;
  req_status: string;
  req_wedding_once_valid: string;
  req_wedding_status: string;
  req_wedding_team_ids: string;
  wechat: string;
  wedding_commission: string;
  wedding_status: string;
  wedding_team_user: string;
}

export interface RequirementEntity {
  reqNormalNum: string,
  reqCloseNum: string
}

/**
 * 客户属性字段
 */
export interface CustomerField {
  id: string;
  name: string;
  isSelected: number;
  data: CustomerField[];
}

export interface TableColumnDataItem {
  id: string;
  name: string;
  isSelected: boolean;
  disable: boolean;
}


export interface TableListItem {
  id: string;
  name: string;
  main_contact_name: string;
  category: string;
  work_city_info: {
    full: string;
  };
  location_city_info: {
    full: string;
  };
  channel: string;
  task_id: string;
  wedding_date: Date;
  budget: string;
  status: string;
  follow_status: string;
  follow_newest: Date;
  follow_next: Date;
  encode_phone: string;
  customer_id: string;
  customer_name: string;
}

export interface TableListParams {
  // sort: string;  // 排序字段名称
  order: string; // 排序方式，正序 倒序
  pageSize: number;
  page: number;
  filter: any;
  op: any;
}

