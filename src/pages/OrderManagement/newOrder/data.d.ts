
/**
创建订单
公共参数	是		参数列表
channel	否	string	客户来源
customerName	否	string	客户姓名
gender	否	string	性别
mobile	否	string	手机号
wechat	否	string	微信号
weddingDay	否	string	婚期
weddingStyle	否	string	婚礼风格
budget	否	string	预算
city	否	string	意向城市
district	否	string	意向区域
category	是	string	品类 多个以英文逗号分隔

bizContent	否	string	业务内容,json串
customerId	否	int	客户ID
reqId	否	int	需求ID
*/
export interface CreateorderParams {
  channel: int;//类型 1:婚纱 2:婚庆 3:婚宴
  customerId: string;//非必传
  customerName: string;
  gender: string;
  mobile: string;
  wechat: string;
  weddingDay: string;
  weddingStyle: string;
  budget: string;//预算
  city: string;
  district: string;
  category:string;


  bizContent:Object;

  hotel:Object;//婚宴
  wedding:Object;// 婚庆
  photography:Object;//婚纱摄影
  car:Object;//婚车
  xiyan:Object;//庆典or喜宴
  oneStop:Object;//一站式

  /**
   * budget: string;//预算
   * tables //桌数
   * merchant // 商户
   * estArrivalTime //到店时间
   * remark // 备注
   *
   * photographyStyle //婚照风格
   * carTime // 用车时间
   * carNum //用车数量
   * carBrand // 用车品牌
   * type // 婚宴类型
   *
   *
   */


  merchant: string;
  photographyStyle: string;
  photographyTime: string;

  hotelStar: string;
  hotelName: string;
  hotelAddress: string;
  hotelHall: string;
  hotelTables: string;
  estArrivalTime: string;
  customerName:string;
}
export interface TableListData {
  list: TableListItem[];
}
interface ConfigListItem {
  id: string;
  name: string;
}
export interface ConfigState {
  channel: ConfigListItem[];
  business: ConfigListItem[];
  followRes: ConfigListItem[];
  weddingStyle: ConfigListItem[];
}
export interface getCustomerName {
  getCustomerByName: Array[];
}

export interface CustomerLisItem {
  customer_id: string;
  customer_name: string;
  phone: string;
  wedding_date: string;
  repeat_audit_status: 0|1|2|3; // 0:未发起,1:待审核,2:驳回,3:审核通过
  repeat_status: string;
  similar_id: string | 0;
}

export interface Merchant {
  id: string;
  name: string;
  city_name: string;
  region_name:string;
  level: string;
  feature: string;
  price: string;
  manager:string;
  manager_mobile:string;
  category_name:string;
  sale_name:string;
}
