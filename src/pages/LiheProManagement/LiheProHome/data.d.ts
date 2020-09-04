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

  pid: string;
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
  count: number;
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
