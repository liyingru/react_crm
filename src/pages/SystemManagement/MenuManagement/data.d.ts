export interface MenuData {
  id: string;
  name: string;
  is_menu: 1 | 2;  // 1菜单  2功能
  icon:string;
  pid: string;
  hasChild: 0 | 1;
  childlist: MenuData[];
  child?: MenuData[];
  status: 0|1;  // 状态(0:关闭;1:正常)
  code:string;
  path:string;
  weight: number;
  spacer:string;
  remark:string;
  menu_type: 0 | 1 | 2; //菜单类型(0:普通类型;1:基础菜单;2:系统菜单)
  tier: number; // 菜单的层级。
}

export interface TableListData {
  menus: MenuData[],
  total: number,
}

export interface TableListPagination {

}

export interface TableListParams {
  // sorter: string;  // 排序方式
  // status: string;  
  // name: string;
  pageSize: number;
  page: number;
  companyId:string;
}

export interface DeleteMenuParams{
  id:string;
}
