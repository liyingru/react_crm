import {AddStructureParams} from "../StructureManagement/data"

export default AddStructureParams;

export interface PositionData {
  id:string;
  company_id:string;
  structure_id:string;
  name:string;
  pid:string;
  pname:string;
  spacer:string;
  status:0|1;
  haschild:0|1;
  childlist: PositionData[];
}

export interface CompanysAndStructuresListItem {
  company_id:string;
  company_name:string;
  structureList: StructureData[];
  total: number;
}


export interface TableListData {
  list: StructureData[];
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

export interface AddPositionParams {
  name: string;
  pid:string;
  status: number;
  company_id:string;
  structure_id:string;
}

export interface EditPositionParams extends AddPositionParams {
  id:string;
}

export interface DeletePositionParams {
  id: string;
}

export interface OptionPositionItem {
  id: string;
  name: string;
  status: number;
  role_ids: [string];
  scale: number;
}

export interface PositionOptionData {
  list: OptionPositionItem[];
}

