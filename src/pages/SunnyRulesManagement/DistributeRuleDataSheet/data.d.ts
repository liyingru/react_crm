
export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface DistributeListData {
  list: RulesListItem[];
  pagination: Partial<Pagination>;
}

export interface DistributeLisItem {
  category: number;
  channel: number;
  channel_txt: string;
  company_id: number;
  company_name: string;
  create_time: string;
  customer_id: number;
  category_txt: string;
  id: number;
  remark: string;
  rule_id: number;
}

export interface SimpleCompany {
  company_id: number;
  company_name: string;
}
