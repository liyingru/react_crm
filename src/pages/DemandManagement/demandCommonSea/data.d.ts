export interface RequestEntity {
  id:                   string;
  req_num:              string;
  channel_txt:   string;
  category:             string;
  city_code:            string;
  budget:               string;
  merchant:             string;
  photo_style:          string;
  photo_time:           string;
  wedding_style:        string;
  hotel:                string;
  hotel_star:           string;
  hotel_tables:         string;
  hotel_hall:           string;
  hotel_type:           string;
  hotel_time:           string;
  car_brand:            string;
  car_series:           string;
  car_num:              string;
  car_time:             string;
  est_arrival_time:     string;
  remark:               string;
  is_del:               string;
  status:               string;
  create_time:          string;
  update_time:          string;
  customer_id:          string;
  user_id:              string;
  owner_id:             string;
  company_id:           string;
  task_id:              string;
  follow_status:        string;
  follow_time:          string;
  follow_tag:           string;
  follow_content:       string;
  follow_num:           string;
  follow_user_id:       string;
  next_contact_time:    string;
  user_name:            string;
  customer_name:        string;
  customer_channel:     string;
  wedding_date:         string;
  task_name:            string;
  category_txt:         string;
  customer_channel_txt: string;
  status_txt:           string;  // 有效单状态
  city_info:            CityInfo;
  follow_tag_txt:       string;
  follow_status_txt:    string;
  follow_user_name:     string;
  allot_time:   string;  // 有效单的分配时间
  kefu:  string;  // 负责客服
  phase:  string;
  phase_txt:  string;
}


export interface CityInfo {
  province: string;
  city: string;
  district: string;
  full: string;
  city_code: string;
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

export interface RequestListData {
  list: RequestEntity[];
  pagination: Partial<TableListPagination>;
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
