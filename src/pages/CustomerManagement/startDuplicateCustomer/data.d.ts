import { string } from "prop-types";

export interface CustomerDetail {
  customerData:    Partial<CustomerData>;
  requirementData: RequirementUser;
  contactUserData: ContactUserData[];
  followData:      FollowListItem[];
  reqTeamData:     ProjectTeam[];
  contractData:    ContractWrapper;
}

export interface RequirementUser{
   my:    RequirementData[];
   other: RequirementData[];
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
 */
export interface CustomerData {
  customerId:        string;
  customerLevel:     string;
  customerLevelText: string;
  channel:           string;
  customerName:      string;
  gender:            string;
  genderText:        string;
  identity:          string;
  identityText:      string;
  weddingDate:       string;
  phone:             string;
  weChat:            string;
  liveCityInfo:      CityInfo;
  liveAddress:       string;
  workCityInfo:      CityInfo;
  workAddress:       string;
  contactTime:       string;
  referrerName:      string;
  likeCityInfo:      CityInfo;
  budget:            string;
  category:          string;
  weddingStyle:      string;
  weddingStyleText:  string;
  deskNum:           string;
  hotel:             string;
  encryptPhone:      string;
  nextContactTime:   string;
  allotTime:         string;
  createTime:        string;
  createUser:        string;
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
  id:               string;
  req_num:          string;
  category:         string;
  budget:           string;
  merchant:         string;
  photo_style:      string;
  photo_time:       string;
  wedding_style:    string;
  hotel:            string;
  hotel_star:       string;
  hotel_tables:     string;
  hotel_hall:       string;
  car_brand:        string;
  car_series:       string;
  car_num:          string;
  car_time:         string;
  est_arrival_time: string;
  status:           string;
  status_txt:	      string;
  create_time:      string;
  update_time:      string;
  user_id:          string;
  customer_id:      string;
  user_name:        string;
  remark:           string;
  city_info:      CityInfo;
  city_code:        string;
}

export interface CityInfo{
  province;         string;
  city:             string;
  district:         string;
  full:             string;
  city_code:        string;
}

export interface RequirementData{
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
  customerId:      string;
  contactId:       string;
  userName:        string;
  identity:        string;
  identityText:    string;
  phone:           string;
  weChat:          string;
  occupation:      string;
  contactTime:     string;
  contactTimeText: string;
  comment:         string;
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
  attachment: string
}

export interface ParamsDetail{
   customerId:string
}

export interface SearchParams {
  page: number
  pageSize: number
  keyword: string
}

export interface RepeatParams {
  keepCid: string;
  repeatCid: string;
  remark: string;
}


//项目成员
export interface ProjectTeam {
  req_id:      string;
  team_name:   string;
  category:    string;
  category_text:string;
  owner:       string;
  owner_id:    string;
  team_member: TeamMember[];
}

export interface TeamMember {
  id:             string;
  team_user_id:   string;
  team_key_name:  string;
  team_user_name: string;
}


export interface ContractWrapper{
   total: number;
   rows:  ContractEntity[];
}

export interface ContractEntity {
  id:             string;
  contract_num:   string;
  category_id:    string;
  contract_alias: string;
  sign_date:      string;
  conduct_date:   string;
  bill_file:      string;
  contract_file:  string;
  biz_id:         string;
  customer_id:    string;
  order_id:       string;
  channel:        string;
  remark:         string;
  preferential:   string;
  total_amount:   string;
  owner_id:       string;
  structure_id:   string;
  company_id:     string;
  status:         string;
  create_by:      string;
  create_time:    string;
  update_by:      string;
  update_time:    string;
  audit_status:   string;
}

export interface ContractItem {
   key:  string;
   type: string;
   value: string | Array;
   columns: Array;
}


export interface UserEntity {
  name:           string;
  id:             string;
  job_number:     string;
  company_name:   string;
  structure_name: string;
}






