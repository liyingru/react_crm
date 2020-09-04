
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

/**
 * customerId	int	客户ID
customerName	string	客户姓名
phone	string	客户电话
customerLevel	string	客户评级
followStatus	string	最新联系结果
followTag	string	最新跟进策略
weddingDate	string	婚期
budget	string	预算
city	string	归属地区
latestServiceTime	string	最近跟进时间
nextContactTime	string	下次跟进时间
channel	string	来源
latestFlowContent	string	最新跟进记录
flowNumber	int	已跟进次数
deskNum	int	桌数
weddingStyle	string	婚礼风格
createTime	string	创建时间
contactTime	string	方便联系时间
serviceUser	string	服务客服
category	string	业务品类
requirement	array	有效单
reqNormalNum	int	有效单正常数量
reqCloseNum	string	有效单已关闭数量
 */
export interface CustomerListItem {
  id:string;
  customerId: string;
  customerName: string;
  phone: string;
  customerLevel: string;
  followStatus: string;
  followTag:string;
  weddingDate: string;
  budget: string;
  city: string;
  latestServiceTime: string;
  nextContactTime: string;
  channel: string;
  latestFlowContent: string;
  flowNumber: string;
  deskNum: string;
  weddingStyle: string;
  createTime: string;
  contactTime: string;
  serviceUser: string;
  category: string;
  requirement: RequirementEntity;
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

