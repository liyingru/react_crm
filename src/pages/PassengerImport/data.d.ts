
export interface ImportLog {
    id:          string;
    name:        string;
    status:      string;
    status_num:  string;
    user_id:     string;
    reason:      string;
    create_time: string;
    user_name:   string;
    json_data:   string;
    type:        string;
    success:     number;
    fail:        number;
}

export interface LeadsListItem {
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
  }

export interface TableListPagination {
    total: number;
    pageSize: number;
    current: number;
}
  
export interface LeadsListData {
    list: LeadsListItem[];
    pagination: Partial<TableListPagination>;
}

export interface ReqListItem {
    id:                   string;
    req_num:              string;
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
    status_txt:           string;
    city_info:            CityInfo;
    follow_tag_txt:       string;
    follow_status_txt:    string;
    follow_user_name:     string;
  }
  
  
  export interface CityInfo {
    province: string;
    city: string;
    district: string;
    full: string;
    city_code: string;
  }

  export interface ReqListData {
    list: ImportReqBean[];
    pagination: Partial<TableListPagination>;
  }

  export interface ImportReqBean
  {
     wedding_year: string,
     wedding_month: string,
     wedding_day: string,
     schedule_type_txt: string,
     hotel: string,
     hotel_hall: string,
     hotel_tables: string,
     groom_name: string,
     groom_phone: string,
     bride_name: string,
     bride_phone: string,
     sale: string,
     kefu: string,
     top_channel_txt: string,
     final_channel_txt: string,
     top_category_txt: string,
     final_category_txt: string,
     create_time: string,
     cehua_time: string,
     cehua_log: string,
     is_arrival_txt: string,
     customer_status_txt: string,
     kefu_time: string,
     kefu_log: string
  }

