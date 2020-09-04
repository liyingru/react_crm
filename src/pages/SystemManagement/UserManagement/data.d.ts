export interface TableListItem {
  id: number;
  job_number: number;
  name: string;
  avatar: string;
  sex: number;
  account: string;
  company_id:string;
  company_name: string;
  structure_id:string;
  structure_name: string;
  position_id:string;
  position_name: string;
  role_id:string;
  role_name: string;
  rank: number;
  correction_date: string;
  status: number;
  last_login_time: string;
  password:string;
  entry_date:string;
  city_code:string;
  moor_number: string;
  moor_type:string;
  ac_account:string;
  trun_number: string;
  loginStatus: 0 | 1; // 用户当前的登录状态
  is_liheuser:0|1;
  birthday:string;
  address:string;
  check_in_or_out: 1 | 2;  // 用户的上线离线状态  1上线  2离线

  // disabled?: boolean;
  // href: string;
  
  // updatedAt: Date;
  // createdAt: Date;
  // progress: number;
}

export interface TableListPagination {
  total: number;  // 总共有多少条数据
  pageSize: number;  // 每一页展示多少条数据
  current: number;  // 当前正在展示第几页
}

/**
 * 带分页
 */
export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  // sort: string;  // 排序字段名称
  order:string; // 排序方式，正序 倒序
  pageSize: number;
  page: number;
  filter: any;
  op: any;
}

export interface ListStructureSubItem {
  id: string; // 部门id
  company_id: string;
  name: string;
  pid:string;  // 上级部门的id
  childlist: ListStructureSubItem[];
  status:0 | 1;
  spacer:string; // 前缀
  tier: number; // 是几级部门
}

export interface ListStructureItem {
  company_id:string;
  company_name: string;
  structureList: ListStructureSubItem[];
  total:number;
}

// export interface OptionCompanyItem {
//   id: string;
//   name: string;
//   status: number;
//   role_ids: [string];
//   scale: number;
// }

// export interface CompanyListData {
//   list: OptionCompanyItem[];
// }

// export interface OptionRoleItem {
//   id: string;
//   name: string;
//   company_id: string;
//   status: number;
//   is_sys: number;
// }

export interface OptionCompanyItem {
  id: string;
  name: string;
}


export interface OptionRoleListParams {

}
