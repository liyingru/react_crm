import { string } from "prop-types";

export interface CustomerDetail {
  customerData: Partial<CustomerData>;
  requirementData: RequirementUser;
  contactUserData: ContactUserData[];
  reqTeamData: ProjectTeam[];
  // contractData:    ContractWrapper;
  reqLiteData: Partial<ReqLiteData>;
  followData: FollowData;
  cooperationData: CooperationData[];
  reserveData: ArriveData[];
}

export interface ArriveData {
  id: string;
  order_id: string;
  req_id: string;
  create_time: string;
  update_time: string;
  reserve_time: string;
  arrival_time: string;
  user_id: string;
  confirm_user_id: string;
  company_id: string;
  user_name: string;
  title: string;
  confirm_user_name: string;
}

export interface CooperationData {
  title: string	//标题
  comment: string	//内容
  create_user: string	//创建人
  create_time: string	//创建时间
}

export interface RequirementUser {
  my: RequirementData[];
  other: RequirementData[];
}

//有效单详情
export interface ReqLiteData {
  role: 0 | 1 | 2 | 3;  // 角色 0:属人,1:归属人,2:领导,3:协作人
  team_user: string;
  kefu: string;
  sale: string;
  next_contact_time: string;
  complaint_status: 0 | 1 | 2 | 3 | 4;  // 客诉审核状态  0表示正常无客诉单，1表示已有客诉单待审核处理，2表示跟进中，3表示投诉升级，4表示客诉单已处理完结可再次发起新的客诉
  complaint_id: string; // 客诉单id
  status: string;    //0无效单 1有效单 2客户合并
  phase: number;  // 有效单阶段：0已关单 1待跟进 2跟进中 3订金已付 4签订合同 5客户合并 6待回访 30无效
  owner_id: string;
  leads_id: string;
  req_id: string;
  associates: string;
  req_num: string;
  level: string;  //需求单评级
  level_txt: string; //评级描述
  category: string;
  top_category: string;

  qt_result: number;
  qt_result_reason: string;
}

export interface FollowData {
  showFollowButton: number;
  showFollowProductAndCoupon: number;
  showDistributedCompany: 0 | 1;  // 是否显示派发公司
  distributedCompany: any[];  // 派发公司列表
  followTab: FollowTab[];
}

export interface FollowTab {
  key: string;
  val: string;
}

/**
customerId	int	客户ID
channel	string	来源
customerName	string	客户姓名
gender	int	性别 (1:女2:男)
genderText	string	性别
identity	int	客户身份(1：新娘、2：新郎、3：新郎父母、4：新郎父母、5：新人亲属、6：新人朋友、7：其他)
identityText	string	客户身份
weddingDate	string	婚期
phone	string	手机号码
weChat	string	微信
liveProvince	string	居住省
liveCity	string	居住市
liveAddress	string	居住地址
workProvince	string	工作省
workCity	string	工作市
workAddress	string	工作地址
contactTime	string	方便联系时间
referrerName	string	推荐方
budget	string	预算
city	string	意向城市
district	string	意向区域
category	string	业务品类
weddingStyle	int	婚礼风格
weddingStyleText	string	婚礼风格
deskNum	string	桌数
hotel	string	酒店
repeatStatus 1|2|3  客户状态 1:正常,2:客户合并,3:亲子单
 */
export interface CustomerData {
  group_customer_id: string;  // 集团客户ID
  customerId: string;
  customerLevel: string;
  customerLevelText: string;
  channel: string;
  channel_id: string;
  customerName: string;
  gender: string;
  genderText: string;
  identity: string;
  identityText: string;
  weddingDate: string;
  phone: string;
  weChat: string;
  liveCityInfo: CityInfo;
  liveAddress: string;
  workCityInfo: CityInfo;
  workAddress: string;
  contactTime: string;
  referrerName: string;
  likeCityInfo: CityInfo;
  budget: string;
  category: string;
  weddingStyle: string;
  weddingStyleText: string;
  deskNum: string;
  hotel: string;
  encryptPhone: string;
  nextContactTime: string;
  allotTime: string;
  createTime: string;
  createUser: string;

  referrerPhone: string;
  customerFollowStatus: string;
  editable: 0 | 1; // 0 不可编辑  1 可编辑

  status_txt: string;

  repeatStatus: 1 | 2 | 3;  //  客户重单状态 1:正常,2:客户合并,3:亲子单
  repeatAuditStatus: 0 | 1 | 2 | 3;  //  客户重单审核状态 0:正常无重单提审 1:待审核,2:驳回,3:通过
  status: number;   // 客户状态
  complaint_status: 0 | 1 | 2 | 3;  // 客诉审核状态

  weddingDateFrom: string;
  weddingDateEnd: string;

  allot_time: string; //客户划入时间
  record_user_id: string;  //(北京)提供人ID
  record_user_name: string; //(北京)提供人
  leads_owner_name: string;  // 需求确认人名字
  leads_owner_id: string; // 需求确认人id
  req_owner_name: string; // 邀约人
  req_owner_id: string; // 邀约人
  order_banquet_owner_name: string;  // 婚宴销售人名字
  order_banquet_owner_id: string; // 婚宴销售人id
  order_wedding_owner_name: string;  // 婚庆销售人名字
  order_wedding_owner_id: string; // 婚庆销售人id
  statusText: string; //客户状态

  category_num: any;
  banquet_commission: string; // 婚宴返佣
  wedding_commission: string; // 婚庆返佣
}

/**
id	int	有效单ID
req_num	string	有效单编号
type	string	类型
type_txt	string	类型文本
city_code	string	城市码
city	string	城市名
district	string	区域
budget	string	预算
merchant	string	推荐商家
photo_style	string	婚照风格
photo_style_txt	string	婚照风格
photo_time	string	婚照拍摄时间
wedding_style	string	婚礼风格
wedding_style_txt	string	婚礼风格
hotel	string	酒店名称
hotel_star	string	酒店星级
hotel_tables	string	酒店桌数
hotel_hall	string	酒店厅名称
car_brand	string	汽车品牌
car_series	string	汽车型号
car_num	string	用车数量
car_time	string	用车时间
est_arrival_time	string	预计到店时间
source	string	来源
status	string	有效单状态
status_txt	string	有效单状态文本
user_id	string	用户ID
customer_id	string	客户ID
 */
export interface RequirementBean {
  id: string;
  req_num: string;
  category: string;
  budget: string;
  merchant: string;
  photo_style: string;
  photo_time: string;
  wedding_style: string;
  hotel: string;
  hotel_star: string;
  hotel_tables: string;
  hotel_hall: string;
  car_brand: string;
  car_series: string;
  car_num: string;
  car_time: string;
  est_arrival_time: string;
  status: string;
  status_txt: string;
  create_time: string;
  update_time: string;
  user_id: string;
  customer_id: string;
  user_name: string;
  remark: string;
  city_info: CityInfo;
  city_code: string;
  category_txt: string;
  phase: string;
}

export interface CityInfo {
  province; string;
  city: string;
  district: string;
  full: string;
  city_code: string;
}

export interface RequirementData {
  category_id: string;
  category_name: string;
  data: RequirementBean[];
}

/**
contactId	int	联系人id
userName	string	联系人姓名
phone	string	客户电话
identity	int	客户身份
identityText	string	客户身份
weChat	string	微信
occupation	string	职业
contactTime	int	方便联系时间
contactTimeText	string	方便联系时间
comment	string	备注
 */
export interface ContactUserData {
  customerId: string;
  contactId: string;
  userName: string;
  identity: string;
  identityText: string;
  phone: string;
  weChat: string;
  occupation: string;
  contactTime: string;
  contactTimeText: string;
  comment: string;
  encryptPhone: string;
}

/**
followTime	string	跟进时间
callDuration	string	通话时长
followType	string	单据类型
results	string	跟进结果
comment	string	沟通内容
nextFollowTime	string	下次跟进时间
contactWay	string	跟进方式(途径)
followUser	string	跟进人
 */
export interface FollowListItem {
  followTime: string
  callDuration: string
  followType: string
  results: string
  comment: string
  nextContactTime: string
  contactWay: string
  followUser: string
  attachment: array
  followTag: string
  arrivalTime: string
  couponName: string
  productName: string
  state: string
}

export interface ParamsDetail {
  customerId: string
}


//项目成员
export interface ProjectTeam {
  req_id: string;
  team_name: string;
  category: string;
  category_text: string;
  owner: string;
  owner_id: string;
  team_member: TeamMember[];
}

export interface TeamMember {
  id: string;
  team_user_id: string;
  team_key_name: string;
  team_user_name: string;
}


export interface ContractWrapper {
  total: number;
  rows: ContractEntity[];
}

export interface ContractEntity {
  id: string;
  contract_num: string;
  category_id: string;
  contract_alias: string;
  sign_date: string;
  conduct_date: string;
  bill_file: string;
  contract_file: string;
  biz_id: string;
  customer_id: string;
  order_id: string;
  channel: string;
  remark: string;
  preferential: string;
  total_amount: string;
  owner_id: string;
  structure_id: string;
  company_id: string;
  status: string;
  create_by: string;
  create_time: string;
  update_by: string;
  update_time: string;
  /** 0-待提交：提交和补充协议 1-待审核 待审批：无操作按钮 2-审核驳回：重新编辑 3-审批通过：补充协议*/
  audit_status: string;
  agreement_num: string;
  category: string;
}

export interface ContractItem {
  key: string;
  type: string;
  value: string | Array;
  columns: Array;
}


export interface UserEntity {
  name: string;
  id: string;
  job_number: string;
  company_name: string;
  structure_name: string;
}



export interface productItemData {
  name: string;
  id: string;
}



