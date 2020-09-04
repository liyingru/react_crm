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

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
  header:[],
}


export interface ClaimData {
  code: string;
  result: string;
}

export interface TableListParams {
  city: string;          //	城市 多个逗号分割
  channel: string;       //	渠道
  category: string;      //	品类
  ac_time: string;       //	开始时间
  end_time: string;      //	结束时间
  follow_status: string; //	跟进结果 0: 全部，1: 未接 / 拒接、2: 已订竞品、3: 需求未明确、4: 重点跟进、5: 不接受服务、6: 第三方待找，7: 诈单
  name: string;          //	名称
  id: string;
  status: string;        //	线索状态 全部、1: 未跟进、2: 待回访、3: 跟进中，4: 已签约

  pageSize: number;
  page: number;
}
