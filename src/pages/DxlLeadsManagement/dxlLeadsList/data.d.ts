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

  id: string;
  phone: string;
  name: string;
  main_contact_name: string;
  category: string;
  category_id: string;
  task_id: string;
  status: string;
  follow_status: string;
  follow_newest: string;
  follow_next: string;
  follow_num: string;
  follow_hour: string;
  create_time: string;
  create_user_id: string;
  status_num: string;
  follow_id: string;
  customer_id: string;
  channel: string;
  source: string;
  wechat: string;
  customer_name: string;
  owner_id: string;

  follow_time_status: boolean;
  req_time_status: boolean;
  callback_time_status: boolean;
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
  all_task: string;
  done_task: string;
  todo_task: string;
  color_status: string;
}

export interface ConfigData {
  channel: ConfigListItem[];
  business: ConfigListItem[];
  followRes: ConfigListItem[];
  weddingStyle: ConfigListItem[];
  source: ConfigListItem[];
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}
export interface Permission {
  callcenteradapter_getrecordlist: boolean;
  requirementadapter_updatereq: boolean;
  requirementadapter_closereq: boolean;
  requirementadapter_openreq: boolean;
  closeotherreq: boolean,
  openotherreq: boolean,
  editotherreq: boolean,
  viewotherreq: boolean,
  recommendreq: boolean,
  recommendotherreq: boolean,
  amindcheckinorout: boolean,
  customeradapter_updatecustomer: boolean,
  dispatchCompany: boolean,
  requirementadapter_createreq: boolean,
  chuangjianxs: boolean,
}
export interface LeadsData {
  id: string;
  phone: string;
  name: string;
  main_contact_name: string;
  category: string;
  task_id: string;
  status: string;
  follow_status: string;
  follow_newest: string;
  follow_next: string;
  follow_num: string;
  follow_hour: string;
  create_time: string;
  create_user_id: string;
  status_num: string;
  follow_id: string;
  customer_id: string;
  channel: string;
  source: string;
  wechat: string;
  customer_name: string;
}

export interface ReceiveUser {
  id: string;
  name: string;
}

export interface DistributeCompany {
  id: string;
  name: string;
}

export interface XPFlowInfo {
  receive_user: ReceiveUser[];
  distribute_company: DistributeCompany[];
}

export interface CustomListItem {
  name: string;
  id: string;
  disable?: boolean;
}

export interface MerchantRemarkItem {
  order_id: number;
  operate_time: string;
  biz_name: string;
  desc: string;
  auth_user_name: string;
}

export interface MerchantRemarkData {
  list: MerchantRemarkItem[];
  pagination: Partial<TableListPagination>;
}

export interface ThirdRecordItem {
  order_id: number;
  service_type: string;
  common_id: number;
  common_name: string;
  calltime: string;
  caller_name: string;
  istalk: string;
  TalkLen: string;
  Talktype: string;
  audio_url: string;
}

export interface ThirdRecordData {
  list: ThirdRecordItem[];
  pagination: Partial<TableListPagination>;
}
