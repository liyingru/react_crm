
// pageSize	否	int	每页条数
// page	否	int	页码
// city	否	string	城市
// channel	否	int	渠道ID
// createStartTime	否	string	创建开始时间
// createEndTime	否	string	创建结束时间
// flowStatus	否	int	跟进状态
// customerName	否	string	客户名称
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

export interface CustomerListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface CustomerListData {
  list: CustomerListItem[];
  pagination: Partial<CustomerListPagination>;
}

export interface RequirementEntity{
   reqNormalNum:string,
   reqCloseNum:string
}

/**
 * 客户属性字段
 */
export interface CustomerField{
  id:string;
  name:string;
  isSelected:number;
  data:CustomerField[];
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
  order:string; // 排序方式，正序 倒序
  pageSize: number;
  page: number;
  filter: any;
  op: any;
}

