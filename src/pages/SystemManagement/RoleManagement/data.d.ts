export interface RoleData {
  id:string;
  name:string;
  is_sys: 0|1;
  company_id:string;
  data_authority:1|2|3|4;
  pid:string;
  status:0|1;
  rights:string;
  service_nodes:string;
  tag:string;
  func_codes:string;
}


export interface CompanyData {
  id:string;
  name: string; 
}

export interface AddRoleParams {
  company_id:string;
  name:string;
}

export interface PermissionSubData {
  id: string;
  name:string;
}

export interface PermissionData {
  title:string;
  options: PermissionSubData[];
}


export interface  RoleTreeData {
  id: string,
  parent: string,
  text: string,
  type: string,
  state: {
    selected: boolean
  }
}

