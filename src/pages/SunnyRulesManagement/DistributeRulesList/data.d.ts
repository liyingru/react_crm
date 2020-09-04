
export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface RulesListData {
  list: RulesListItem[];
  pagination: Partial<Pagination>;
}

export interface RulesListItem {
  id: string;
  name: string;
  activity_id: string;
  activity_name: string;
  user_id: string;
  status: string;
  create_time: string;
  update_time: string;
  kj: string;
  bkj: string;
  kjChannelName: string;
  bkjChannelName: string;
  is_invite: string;
  is_customer_grade: string;
  user_name: string;
  is_skip: string;
}

export interface SimpleCompany {
  company_id: number;
  company_name: string;
}
