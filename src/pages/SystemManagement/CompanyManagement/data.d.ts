export interface TableListItem {
  id: number;
  name: string;
  address: string;
  intro: string;
  scale:string;
  role_ids:string;
  status: number;
  create_time:string;
  update_time: string;
  address_region: string;
  longitude: string;
  latitude: string;
  show_phone:0 | 1;
  tag:string;
}

export interface TableListPagination {
  total: number;  // 总共有多少条数据
  pageSize: number;  // 每一页展示多少条数据
  current: number;  // 当前正在展示第几页
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  // sorter: string;  // 排序方式
  status: string;  
  name: string;
  pageSize: number;
  page: number;
  
}

export interface AddCompanyParams {
  name: string;
  role_ids:string;
  status: number;
  address: string;
  intro: string;
  scale: number;
}

export interface DeleteCompanyParams {
  id: string;
}

export interface OptionCompanyItem {
  id: string;
  name: string;
  status: number;
  role_ids: [string];
  scale: number;
}

export interface CompanyOptionData {
  list: OptionCompanyItem[];
}

