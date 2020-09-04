
export interface TableListPagination {
    total: number;
    pageSize: number;
    current: number;
  }
  
  export interface TableListData {
    list: TableListItem[];
    pagination: Partial<TableListPagination>;
  }

  export interface TableListItem {
    req_qa_id: number,
    channel_name: string,
    source_company_name: string,
    customer_name: string,
    category_name: string,
    follow_time: string,
    follow_status: string,
    follow_content: string,
    follow_num: string,
    follow_user: string,
    close_reason: string,
    delimit_time: string,
  }

  export interface Statistical{
    all_invalid_total:        string;
    today_receive_total:      string;
    today_follow_total:       string;
    today_undetermined_total: string;
    today_invalid_total:      string;
    today_activation_total:   string;
  }

export interface ReqConfig {
  phase:           ReqConfigItem[];
  company:         ReqConfigItem[];
  company_channel: CompanyChannel[];
}

export interface CompanyChannel {
  company_id: number;
  channel:    ReqConfigItem[];
}

export interface ReqConfigItem {
  id:   number;
  name: string;
  value: number;
  label: string;
  pid: number;
  children: ReqConfigItem[];
}

  
