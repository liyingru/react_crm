export interface StructureData {
  id: string;
  name: string;
  pid: string;
  pname:string;
  hasChild: 0 | 1;
  childlist: StructureData[];
  status: number;
  company_id: string;
  spacer:string;
}

export interface CompanysAndStructuresListItem {
  company_id:string;
  company_name:string;
  structureList: StructureData[];
  total: number;
}

export interface TableListPagination {
  total: number;  // 总共有多少条数据
  pageSize: number;  // 每一页展示多少条数据
  current: number;  // 当前正在展示第几页
}

export interface TableListData {
  company: CompanyData
  list: StructureData[];
  // pagination: Partial<TableListPagination>;
  // pagination: false;
}

export interface TableListParams {
  // sorter: string;  // 排序方式
  // status: string;  
  // name: string;
  pageSize: number;
  page: number;
  company_id:string;
}

export interface CompanyData {
  id:string;
  name: string; 
}

export interface AddStructureParams {
  name: string;
  role_ids:string;
  status: number;
  address: string;
  intro: string;
  scale: number;
}

export interface DeleteStructureParams {
  id: string;
}

export interface OptionStructureItem {
  id: string;
  name: string;
  status: number;
  role_ids: [string];
  scale: number;
}

export interface StructureOptionData {
  list: OptionStructureItem[];
}

